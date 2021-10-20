import { h } from "preact";
import htm from "htm";
import * as d3 from "d3";
import { useEffect, useState, useRef } from "preact/hooks";
import { isEmpty } from "lodash-es";
import Typography from "@mui/material/Typography";
const html = htm.bind(h);

function updateBarChart(svg, data, dimensions) {
  const height = dimensions.height;
  const margins = dimensions.margins;

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.count)])
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
  initialData,
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
    bottom: 0.08 * height,
  };

  const dimensions = { width: width, height: height, margins: margins };

  // Initial setup
  useEffect(() => {
    if (!isEmpty(initialData) && d3Container.current) {
      const svg = d3.select(d3Container.current);

      const data = initialData;

      const x = d3
        .scaleBand()
        .domain(initialData.map((d) => d[field]))
        .range([margins.left, width - margins.right])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.count)])
        .nice()
        .range([height - margins.bottom, margins.top]);

      const domain = { x: x, y: y };

      initializeBarChart(svg, data, domain, colorPalette, field, dimensions);
    }
  }, [initialData]);

  // Refresh setup
  useEffect(() => {
    if (!isEmpty(objData) && d3Container.current && selected) {
      const svg = d3.select(d3Container.current);

      updateBarChart(svg, objData, dimensions);
    }
  }, [objData]);

  // Return to global on hover-out
  useEffect(() => {
    if (!isEmpty(initialData) && !selected) {
      const svg = d3.select(d3Container.current);

      updateBarChart(svg, initialData, dimensions);
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
