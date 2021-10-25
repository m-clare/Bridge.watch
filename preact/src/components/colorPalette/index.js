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
      .domain(d3.range(0, 10))
      .range([
        "#a50026",
        "#d73027",
        "#f46d43",
        "#fdae61",
        "#fee090",
        "#e0f3f8",
        "#abd9e9",
        "#74add1",
        "#4575b4",
        "#313695",
      ])
      .interpolate(d3.interpolateRgb.gamma(2.2));

const colorDict = {
  "rating": ratingColor,
  "year_built": yearBuiltColor
};

export { colorDict };
