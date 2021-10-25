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
    let x;
    let min;
    let max;
    let domain;
    let histogram;
    let rawHistogram;
    let allCount;
    let allHistogram;

    let d3Histogram; // undefined if not year built
    //precalculate binning function for hexBin if year built is field
    if (field === "year_built") {
      min = 1900;
      max = +d3.max(bridgeInfo.map((d) => d[field]));
      domain = d3.range(min, max + 1, 5);
      d3Histogram = d3.histogram().domain([min, max]).thresholds(domain.length);
    }

    if (field === "year_built") {
      rawHistogram = d3Histogram(bridgeInfo.map((d) => d[field]));
      allHistogram = rawHistogram.map((d) => ({
        count: d.length,
        year_built: d.x0,
        "year excluded": d.x1,
      }));
    } else {
      allCount = countBy(bridgeInfo.map((d) => d[field]));
      allKeyData["count"] = bridgeInfo.map((d) => d[field]).length;
      allHistogram = Object.keys(allCount)
        .sort()
        .map((d) => ({ [field]: +d, count: allCount[d] }));
    }


    let rangeValues = Array.from(new Set(allHistogram.map((d) => d[field])));
    let emptyHist = object(rangeValues, new Array(rangeValues.length).fill(0));

    const rawHex = customHexbin(bridgeInfo);

    // simplified information from calculated hexbins
    let hexBin = rawHex.map(function (d, i) {
      const index = i;
      const interestValue = d3.median(d, (x) => x[field]);
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
      if (field === "year_built") {
        rawHistogram = d3Histogram(d.map((d) => d[field]));
        let rawobjHistogram = rawHistogram.map((d) => ({
          count: d.length,
          year_built: d.x0,
          "year excluded": d.x1,
        }));
        histogram = object(
          rawobjHistogram.map((d) => d["year_built"]),
          rawobjHistogram.map((d) => d.count)
        );
      } else {
        histogram = countBy(d.map((x) => x[field]));
      }
      histogram = { ...emptyHist, ...histogram };

      const objHistogram = Object.keys(histogram)
        .sort()
        .map((d) => ({ [field]: +d, count: histogram[d] }));
      return { interestValue, x, y, objKeyValues, objHistogram, count };
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
