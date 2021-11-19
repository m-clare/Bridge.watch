import * as d3 from "d3";
import { colorDict } from "../colorPalette";
import { monthNames, plotOptions } from "../options";


function addDays(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function barChart(svgWidth, svgHeight, position, data, field) {


  const color = colorDict[field];
  const displayName = plotOptions[field]["histogram"];

  const width = 400;
  const height = 200;
  const margins = {
    left: 0.01 * width,
    right: 0.01 * width,
    top: Math.min(0.205 * height, 48),
    bottom: Math.min(0.205 * height, 48),
  };
  // adjust position if at the edge...
  let adjustedPosition = position;
  // too far right
  if (position[0] + width > svgWidth) {
    adjustedPosition[0] = position[0] - width
  }
  // too far top
  if (position[1] + height > svgHeight) {
    adjustedPosition[1] = position[1] - height
  }

  let x;
  if (field === "future_date_of_inspection") {
    const today = new Date();
    const min = new Date(Date.UTC(today.getFullYear(), today.getMonth()));
    const max = addDays(min, 365);
    x = d3
      .scaleUtc()
      .domain(data.map((d) => d[field]))
      .range([margins.left + 8, width - (margins.right + 8)])
      .padding(0.1);
  } else {
    x = d3
      .scaleBand()
      .domain(data.map((d) => d[field]))
      .range([margins.left + 8, width - (margins.right + 8)])
      .padding(0.1);
  }

  // handle empty histogram
  let max;
  if (d3.max(data, (d) => d.count) === 0) {
    max = 1;
  } else {
    max = d3.max(data, (d) => d.count);
  }
  const y = d3
        .scaleLinear()
        .domain([0, max])
        .nice()
        .range([height - margins.bottom, margins.top]);

  // too far bottom
  const svg = d3.create("svg").attr("id", "toolBarChart")
        .attr("transform", `translate(${adjustedPosition[0]}, ${adjustedPosition[1]})`)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("display", "block")

  // set svg background
  svg
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#fff")
    .attr("opacity", "0.8")

  // add bars
  svg.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d[field]))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => y(0) - y(d.count))
    .attr("fill", (d) => color(d[field]));

  // add x axis
  const xAxis = svg.append("g").attr("id", "xAxis")
  xAxis.attr("transform", `translate(0, ${height - margins.bottom})`);

  // limit number of labels based on bins
  if (data.map((d) => d.field).length <= 10) {
    xAxis
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr("font-size", "1.0em");
  } else {
    xAxis
      .call(
        d3
          .axisBottom(x)
          .tickFormat((interval, i) => {
            let modInterval;
            if (field === "future_date_of_inspection") {
              modInterval =
                monthNames[interval.getUTCMonth()] + "-" + interval.getUTCFullYear();
            } else {
              modInterval = interval;
            }
            return i % 4 !== 0 ? " " : modInterval;
          })
          .ticks(x.domain().length + 1)
      )
      .attr("font-size", "1.0em");
  }

  svg.append("g")
    .append("text")
    .attr("x", width - 6)
    .attr("y", height - 6)
    .attr("fill", "currentColor")
    .attr("text-anchor", "end")
    .text(displayName + " →");


  // add labels
  svg
    .select("g")
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "1.0em")
    .attr("x", (d) => x(d[field]) + x.bandwidth() / 2)
    .attr("dy", "-.5em")
    .attr("y", (d) => y(d.count))
    .text((d) => {
      if (d.count === 0) {
        return " "
      } else {
        return d.count
      }
      });

  return svg.node();
}
