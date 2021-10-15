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
  const avg = d3.mean(dataArray, (d) => d[field]).toPrecision(2);
  const median = d3.median(dataArray, (d) => d[field]);
  const mode = d3.mode(dataArray, (d) => d[field]);
  return { min: min, max: max, avg: avg, median: median, mode: mode };
}

function getHexbinData(data) {
  let parsedData = d3.csvParse(data)

  const keys = new Set(Object.keys(parsedData[0]));
  const location_set = new Set(["latitude", "longitude"]);
  const field = difference(keys, location_set);
  let rangeValues = Array.from(new Set(parsedData.map((d) => d[field])));
  let emptyHist = object(rangeValues, new Array(rangeValues.length).fill(0));

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
  const allCount = countBy(bridgeInfo.map((d) => d[field]));
  const allKeyData = getKeyProps(bridgeInfo, field);
  allKeyData["count"] = bridgeInfo.map((d) => d[field]).length;

  const allHistogram = Object.keys(allCount)
    .sort()
    .map((d) => ({ [field]: +d, count: allCount[d] }));

  // simplified information from calculated hexbins
  let hexBin = customHexbin(bridgeInfo).map(function (d, i) {
    const index = i;
    const commonValue = d3.mode(d, (x) => x[field]);
    const min = d3.min(d, (x) => x[field]);
    const max = d3.max(d, (x) => x[field]);
    const avg = d3.mean(d, (x) => x[field]).toPrecision(2);
    const median = d3.median(d, (x) => x[field]);
    const x = d.x;
    const y = d.y;
    const hexLocation = projection
      .invert([d.x, d.y])
      .map((d) => d.toPrecision(4));
    let histogram = countBy(d.map((x) => x[field]));
    histogram = { ...emptyHist, ...histogram };
    const objHistogram = Object.keys(histogram)
      .sort()
      .map((d) => ({ [field]: +d, count: histogram[d] }));
    const count = objHistogram.map((d) => d.count).reduce((r, i) => r + i);
    const objKeyValues = getKeyProps(d, field);
    objKeyValues.hexLocation = hexLocation;
    objKeyValues.count = count;
    return { commonValue, x, y, objHistogram, objKeyValues, count };
  });

  const hexBridge = {
    ratingValues: allHistogram,
    natData: allKeyData,
    hexBin: hexBin,
    field: field,
  };

  return hexBridge;
}

export { getHexbinData };
