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
  let fieldOnly;
  if (field === "future_date_of_inspection") {
    fieldOnly = dataArray.map((d) => d[field]);
    const min = d3.min(fieldOnly);
    const max = d3.max(fieldOnly);
    const mode = d3.mode(fieldOnly);
    const count = dataArray.length;
    return {
      min: min,
      max: max,
      mode: mode,
      count: count,
    };
  } else {
    fieldOnly = dataArray.map((d) => +d[field]);
    const min = d3.min(fieldOnly);
    const max = d3.max(fieldOnly);
    const avg = d3.mean(fieldOnly);
    const median = d3.median(fieldOnly);
    const mode = d3.mode(fieldOnly);
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
}

function addDays(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getStatebinData(data) {
  let startTime = Date.now();
  const [columns, ...parsedData] = d3.csvParse(data);
  let msElapsed = Date.now() - startTime;
  console.log(`csvParse took ${msElapsed / 1000} seconds to complete.`);

  if (parsedData.length !== 0) {
    // get objects by fips code
    const keys = new Set(Object.keys(parsedData[0]));
    // TODO: This is brittle, what happens if field != 1
    const field = difference(keys, db_fields);

    // define x domain and binning
    let min;
    let max;
    let domain;
    let rawHistogram;

    if (field === "rating") {
      min = 0;
      max = 9;
      domain = d3.range(min, max + 1, 1);
    } else if (field === "year_built") {
      min = 1900;
      max = 2021;
      domain = d3.range(min, max + 1, 5);
    } else if (field === "repair_cost_per_foot") {
      min = 0;
      max = 150;
      domain = d3.range(min, max + 1, 5);
    } else if (field === "average_daily_traffic") {
      min = 0;
      max = 60000;
      domain = d3.range(min, max + 1, 3000);
    } else if (field === "truck_traffic") {
      min = 0;
      max = 8000;
      domain = d3.range(min, max + 1, 500);
    } else if (field === "future_date_of_inspection") {
      const today = new Date();
      min = new Date(Date.UTC(today.getFullYear(), today.getMonth()));
      max = addDays(min, 365);
      domain = d3.scaleUtc().domain([min, max]).nice();
    } else {
      throw new Error("invalid field");
    }

    let formattedData;
    if (field === "future_date_of_inspection") {
      formattedData = parsedData.map((d) => {
        const dateInspect = d[field].split("-");
        // NOTE: Javascript months are ZERO INDEXED -->
        // Python 1 -> Javascript 0
        return {
          ...d,
          [field]: new Date(
            Date.UTC(dateInspect[0], dateInspect[1] - 1, dateInspect[2])
          ),
        };
      });
    } else {
      formattedData = parsedData;
    }

    const allKeyData = getKeyProps(formattedData, field);
    let d3Histogram;
    if (field === "future_date_of_inspection") {
      d3Histogram = d3
        .histogram()
        .domain([min, max])
        .thresholds(domain.ticks());
    } else {
      d3Histogram = d3
        .histogram()
        .domain([min, max + 1])
        .thresholds(domain);
    }
    rawHistogram = d3Histogram(formattedData.map((d) => d[field]));
    const allHistogram = rawHistogram.map((d) => ({
      count: d.length,
      [field]: d.x0,
    }));
    // NOTE: add leading zero to fips where necessary
    // (db is #, d3 maps are strings)
    const parsedFips = formattedData.map((d) => ({
      ...d,
      fips_code: d["fips_code"].padStart(5, "0"),
    }));
    const infoByCounty = groupBy(parsedFips, "fips_code");

    let countyBin = Object.keys(infoByCounty).map(function (d) {
      const county_code = d;
      const objKeyValues = getKeyProps(infoByCounty[d], field);
      const count = objKeyValues.count;
      const countyName = infoByCounty[d][0].county_name;
      let histogram;
      const statebinHistogram = d3Histogram(
        infoByCounty[d].map((d) => d[field])
      );
      const objHistogram = statebinHistogram.map((d) => ({
        count: d.length,
        [field]: d.x0,
      }));
      return {
        fips: d,
        countyName: countyName,
        objKeyValues,
        objHistogram,
        count,
      };
    });

    const stateBridge = {
      totalValues: allHistogram,
      keyData: allKeyData,
      countyBin: countyBin,
      field: field,
    };
    return stateBridge;
  } else {
    return { message: "No bridges found for your query!" };
  }
}

export { getStatebinData };
