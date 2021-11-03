import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { object } from "underscore";
import { countBy } from "lodash-es";

// Constant values for scaling, aspectRatio, etc.
const width = 975;
const height = 610;
const scaleValue = 1300;

const projection = d3
  .geoAlbersUsa()
  .scale(scaleValue)
  .translate([width * 0.5, height * 0.5]);

const customHexbin = hexbin()
  .extent([
    [0, 0],
    [width, height],
  ])
  .radius(10);

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

function getHexbinData(data) {
  let startTime = Date.now();
  let parsedData = d3.csvParse(data);
  let msElapsed = Date.now() - startTime;
  console.log(`csvParse took ${msElapsed / 1000} seconds to complete.`);

  if (parsedData.length !== 0) {
    const keys = new Set(Object.keys(parsedData[0]));
    const location_set = new Set(["latitude", "longitude"]);
    const field = difference(keys, location_set);

    // remove any missing lat/long/field parsedData
    let bridgeInfo = parsedData
      .map((d) => {
        const p = projection([d.longitude, d.latitude]);
        if (p === null) {
          return null;
        }
        p[field] = +d[field];
        return p;
      })
      .filter((el) => el != null);

    // aggregate data for all points before binning
    const allKeyData = getKeyProps(bridgeInfo, field);

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
    console.log(d3Histogram.domain())
    rawHistogram = d3Histogram(bridgeInfo.map((d) => d[field]));
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
    console.log(allHistogram)

    const rawHex = customHexbin(bridgeInfo);

    // simplified information from calculated hexbins
    let hexBin = rawHex.map(function (d, i) {
      const index = i;
      const x = d.x;
      const y = d.y;
      const hexLocation = projection
        .invert([d.x, d.y])
        .map((d) => d.toPrecision(4));
      const objKeyValues = getKeyProps(d, field);
      objKeyValues.hexLocation = hexLocation;
      const count = objKeyValues.count;

      // do histogram binning on specific range
      // (reduces number of bins for year ranges)
      let histogram;

      const hexbinHistogram = d3Histogram(d.map((d) => d[field]));
      const hexRawHistogram = hexbinHistogram.map((d) => ({
        count: d.length,
        [field]: +d.x0
      }))
      histogram = object(
        hexRawHistogram.map((d) => +d[field]),
        hexRawHistogram.map((d) => d.count)
      );
      histogram = { ...emptyHist, ...histogram };

      const objHistogram = Object.keys(histogram)
            .sort(function(a, b) { return a - b})
            .map((d) => ({ [field]: +d, count: histogram[d] }));
      return { x, y, objKeyValues, objHistogram, count };
    });

    const hexBridge = {
      totalValues: allHistogram,
      natData: allKeyData,
      hexBin: hexBin,
      field: field,
    };
    return hexBridge;
  } else {
    return { message: "No bridges found for your query!" };
  }
}

export { getHexbinData };
