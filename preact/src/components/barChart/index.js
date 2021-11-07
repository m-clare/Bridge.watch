import { h } from "preact";
import htm from "htm";
import * as d3 from "d3";
import { useEffect, useState, useRef } from "preact/hooks";
import { isEmpty } from "lodash-es";
import Typography from "@mui/material/Typography";
import { colorDict } from "../colorPalette";
import { plotOptions } from "../options";
const html = htm.bind(h);


function updateBarChart(svg, data, dimensions) {
  const height = dimensions.height;
  const margins = dimensions.margins;

  let max;
  if (d3.max(data, (d) => d.count) === 0) {
    max = 1;
  } else {
    max = d3.max(data, (d) => d.count)
  }

  const y = d3
    .scaleLinear()
    .domain([0, max])
    .nice()
    .range([height - margins.bottom, margins.top]);

  svg
    .select("g")
    .selectAll("rect")
    .data(data)
    .transition()
    .duration(1000)
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => y(0) - y(d.count));

  svg
    .select("g")
    .selectAll("text")
    .data(data)
    .transition()
    .duration(1000)
    .attr("y", (d) => y(d.count))
    .text((d) => d.count);
}

function initializeBarChart(svg, data, domain, color, field, dimensions) {
  const x = domain.x;
  const y = domain.y;

  const height = dimensions.height;
  const width = dimensions.width;
  const margins = dimensions.margins;

  const getBars = () => {
    if (!document.getElementById("bars")) {
      svg.append("g").attr("id", "bars");
    }
    return svg.select("#bars");
  };
  const barNode = getBars();

  // add bars
  barNode
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d[field]))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => y(0) - y(d.count))
    .attr("fill", (d) => color(d[field]));

  const getXAxis = () => {
    if (!document.getElementById("xAxis")) {
      svg.append("g").attr("id", "xAxis");
    }
    return svg.select("#xAxis");
  };
  const xAxisNode = getXAxis();

  //add x axis
  xAxisNode.attr("transform", `translate(0, ${height - margins.bottom})`);

  // limit number of labels based on bins
  if (data.map((d) => d.field).length <= 16) {
    xAxisNode
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr("font-size", "1.2em");
  } else {
    xAxisNode
      .call(
        d3
          .axisBottom(x)
          .tickFormat((interval, i) => {
            return i % 2 !== 0 ? " " : interval;
          })
          .ticks(x.domain().length + 1)
      )
      .attr("font-size", "1.2em");
  }

  const displayName = plotOptions[field]['histogram'];

  const getXAxisLabel = () => {
    if (!document.getElementById("xaxislabelContainer")) {
      xAxisNode.append("g").attr("id", "xaxislabelContainer");
    }
    return svg.select("#xaxislabelContainer");
  };

  const xAxisLabelNode = getXAxisLabel();
  xAxisLabelNode.select("text").remove();

  xAxisLabelNode
    .append("text")
    .attr("x", width)
    .attr("y", margins.bottom - 6)
    .attr("fill", "currentColor")
    .attr("text-anchor", "end")
    .text(displayName + " →")


  // add labels
  svg
    .select("g")
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "1.2em")
    .attr("x", (d) => x(d[field]) + x.bandwidth() / 2)
    .attr("dy", "-.5em")
    .attr("y", (d) => y(d.count))
    .text((d) => d.count);
}

export function BarChart({
  selected,
  initialHistData,
  objData,
  colorPalette,
  barHeight,
  field,
}) {
  // xDomain may not be necessary since barChart does not update domains
  // for transitions between datasets
  // const [xDomain, setXDomain] = useState({});
  const d3Container = useRef(null);

  const width = 800;
  const height = barHeight;
  const margins = {
    left: 0.005 * width,
    right: 0.005 * width,
    top: 0.08 * height,
    bottom: Math.min(0.16* height, 48),

  };

  const dimensions = { width: width, height: height, margins: margins };

  // Initial setup
  useEffect(() => {
    if (!isEmpty(initialHistData) && d3Container.current) {
      const svg = d3.select(d3Container.current);

      const color = colorDict[field]
      const data = initialHistData;

      const x = d3
        .scaleBand()
        .domain(initialHistData.map((d) => d[field]))
            .range([margins.left + 8, width - (margins.right + 8)])
        .padding(0.1);

      // handle empty histogram
      let max;
      if (d3.max(data, (d) => d.count) === 0) {
        max = 1;
      } else {
        max = d3.max(data, (d) => d.count)
      }
      const y = d3
        .scaleLinear()
        .domain([0, max])
        .nice()
        .range([height - margins.bottom, margins.top]);

      const domain = { x: x, y: y };

      initializeBarChart(svg, data, domain, color, field, dimensions);
    }
  }, [initialHistData]);

  // Refresh setup
  useEffect(() => {
    if (!isEmpty(objData) && d3Container.current && selected) {
      const svg = d3.select(d3Container.current);

      updateBarChart(svg, objData, dimensions);
    }
  }, [objData]);

  // Return to global on hover-out
  useEffect(() => {
    if (!isEmpty(initialHistData) && !selected) {
      const svg = d3.select(d3Container.current);

      updateBarChart(svg, initialHistData, dimensions);
    }
  });

  return html`
    <div>
      <svg
        ref=${d3Container}
        viewBox="0 0 ${width} ${height}"
        id="barPlot"
        style="visibility: visible"
      />
    </div>
  `;
}
