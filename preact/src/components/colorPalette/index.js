// Color settings (initial hardcode for ratings data)
// potential color scales - numerical range, categorical, categorical/numerical
import * as d3 from "d3";

const ratingColor = d3
  .scaleLinear()
  .domain([0, 3, 6, 9])
  .range(["darkred", "red", "yellow", "darkgreen"])
  .interpolate(d3.interpolateRgb.gamma(2.2));

const yearBuiltColor = d3
  .scaleLinear()
  .domain([1900, 1915, 1930, 1945, 1960, 1975, 1990, 2005, 2022])
  .range([
    "#f7fcf0",
    "#e0f3db",
    "#ccebc5",
    "#a8ddb5",
    "#7bccc4",
    "#4eb3d3",
    "#2b8cbe",
    "#0868ac",
    "#084081",
  ])
  .interpolate(d3.interpolateRgb.gamma(2.2));

const ratingColorblind = d3
  .scaleLinear()
  .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  .range([
    "#a50026",
    "#be1827",
    "#d73027",
    "#f46d43",
    "#fdae61",
    "#fee090",
    "#ffffbf",
    "#e0f3f8",
    "#74add1",
    "#313695",
  ])
  .interpolate(d3.interpolateRgb.gamma(2.2));

const percentPoor = d3
  .scaleLinear()
  .domain([0, 33, 67, 101])
  .range(["#ffffcc", "#e31a1c", "#bd0026", "#800026"])
  .interpolate(d3.interpolateRgb.gamma(2.2));

const colorDict = {
  rating: ratingColorblind,
  year_built: yearBuiltColor,
  percent_poor: percentPoor,
  repair_cost_per_foot: percentPoor
};


export { colorDict };
