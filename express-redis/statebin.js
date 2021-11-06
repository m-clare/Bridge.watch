import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { object } from "underscore";
import { countBy } from "lodash-es";
import { groupBy } from "underscore";

const db_fields = [
  "state_name",
  "county_name",
  "fips_code",
  "material",
  "type",
  "service",
  "latitude",
  "longitude",
];

function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  if (_difference.length > 1) {
    throw "Too many properties for histogram.";
  } else {
    return _difference.values().next().value;
  }
}

function getKeyProps(dataArray, field) {
  const min = d3.min(dataArray, (d) => d[field]);
  const max = d3.max(dataArray, (d) => d[field]);
  const avg = d3.mean(dataArray, (d) => d[field]);
  const median = d3.median(dataArray, (d) => d[field]);
  const mode = d3.mode(dataArray, (d) => d[field]);
  const count = dataArray.length;
  return {
    min: min,
    max: max,
    avg: avg,
    median: median,
    mode: mode,
    count: count,
  };
}

function getStatebinData(data) {
  let startTime = Date.now();
  const [columns, ...parsedData] = d3.csvParse(data);
  let msElapsed = Date.now() - startTime;
  console.log(`csvParse took ${msElapsed / 1000} seconds to complete.`);

  if (parsedData.length !== 0) {
    // get objects by fips code
    const keys = new Set(Object.keys(parsedData[0]))
    // TODO: This is brittle, what happens if field != 1
    const field = difference(keys, db_fields)

    const allKeyData = getKeyProps(parsedData, field)

    // define x domain and binning
    let min;
    let max;
    let domain;
    let histogram;
    let rawHistogram;

    if (field === "rating") {
      min = 0
      max = 9
      domain = d3.range(min, max+1, 1);
    } else if (field === "year_built") {
      min = 1900;
      max = 2021;
      domain = d3.range(min, max+1, 5)
    } else if (field === "repair_cost_per_foot") {
      min = 0
      max = 150
      domain = d3.range(min, max+1, 5);
    } else {
      throw new Error("invalid field");
    }
    const emptyHist = object(domain, new Array(domain.length).fill(0));
    const d3Histogram = d3.histogram().domain([min, max+1]).thresholds(domain.length);
    rawHistogram = d3Histogram(parsedData.map((d) => d[field]));
    rawHistogram = rawHistogram.map((d) => ({
      count: d.length,
      [field]: +d.x0
    }))
    histogram = object(
      rawHistogram.map((d) => +d[field]),
      rawHistogram.map((d) => d.count)
    );
    const allCount = { ...emptyHist, ...histogram };
    const allHistogram = Object.keys(allCount)
          .sort(function(a, b) { return a - b})
          .map((d) => ({ [field]: +d, count: allCount[d] }));

    // add leading zero to fips where necessary (db is #, d3 maps are strings)
    const parsedFips = parsedData.map((d) => ({...d, 'fips_code': d['fips_code'].padStart(5, "0")}))
    const infoByCounty = groupBy(parsedFips, "fips_code")

    let countyBin = Object.keys(infoByCounty).map(function(d) {
      const county_code = d;
      const objKeyValues = getKeyProps(infoByCounty[d], field)
      const count = objKeyValues.count
      const countyName = infoByCounty[d][0].county_name;
      let histogram;
      const statebinHistogram = d3Histogram(infoByCounty[d].map((d) => d[field]));
      const stateRawHistogram = statebinHistogram.map((d) => ({
        count: d.length,
        [field]: +d.x0
      }))
      histogram = object(
        stateRawHistogram.map((d) => +d[field]),
        stateRawHistogram.map((d) => d.count)
      );
      histogram = {...emptyHist, ...histogram};
      const objHistogram = Object.keys(histogram)
            .sort(function(a, b) { return a - b})
            .map((d) => ({ [field]: +d, count: histogram[d] }));

      return ({'fips': d, 'countyName': countyName, objKeyValues, objHistogram, count})
    })

    const stateBridge = {
      totalValues: allHistogram,
      keyData: allKeyData,
      countyBin: countyBin,
      field: field
    }
    return stateBridge;
  } else {
    return { message: "No bridges found for your query!" };
  }
}

export { getStatebinData };
