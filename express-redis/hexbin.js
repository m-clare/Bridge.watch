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

function addDays(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
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
        if (field === "future_date_of_inspection") {
          const dateArray = d[field].split("-");
          // NOTE: Javascript months are ZERO INDEXED -->
          // Python 1 -> Javascript 0
          p[field] = new Date(
            Date.UTC(dateArray[0], dateArray[1] - 1, dateArray[2])
          );
        } else {
          p[field] = +d[field];
        }
        return p;
      })
      .filter((el) => el != null);

    // aggregate data for all points before binning
    const allKeyData = getKeyProps(bridgeInfo, field);

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
      max = 100000;
      domain = d3.range(min, max + 1, 5000);
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
    rawHistogram = d3Histogram(bridgeInfo.map((d) => d[field]));
    const allHistogram = rawHistogram.map((d) => ({
      count: d.length,
      [field]: d.x0,
    }));
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
      const hexbinHistogram = d3Histogram(d.map((d) => d[field]));
      const objHistogram = hexbinHistogram.map((d) => ({
        count: d.length,
        [field]: d.x0,
      }));
      return { x, y, objKeyValues, objHistogram, count };
    });

    const hexBridge = {
      totalValues: allHistogram,
      keyData: allKeyData,
      hexBin: hexBin,
      field: field,
    };
    return hexBridge;
  } else {
    return { message: "No bridges found for your query!" };
  }
}

export { getHexbinData };
