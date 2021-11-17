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

const trafficColor = d3
      .scaleLinear()
      .domain([0, 12500, 25000, 37500, 50000, 62500, 75000, 87500, 100000])
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

function addDays(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const inspectionColor = d3
      .scaleLinear()
      .domain([new Date(), addDays(new Date(), 365)])
      .range([
        "#0e306b",
        "#dfe9fb"
      ])
      .interpolate(d3.interpolateRgb.gamma(1));

const trafficTruckColor = d3
      .scaleLinear()
      .domain([0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000])
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
  repair_cost_per_foot: percentPoor,
  average_daily_traffic: trafficColor,
  truck_traffic: trafficTruckColor,
  future_date_of_inspection: inspectionColor
};


export { colorDict };
