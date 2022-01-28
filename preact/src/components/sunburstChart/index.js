import { h } from "preact";
import htm from "htm";
import { useEffect, useRef, useState } from "preact/hooks";
import * as d3 from "d3";
import { isEmpty } from "lodash-es";

import { grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const html = htm.bind(h);

// Based on Zoomable Sunburst from Observable, attribution below
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/zoomable-sunburst

// Constant values for scaling, aspectRatio, etc.
const width = 975;
const height = width;
const radius = width / 6; // 2 layers visible
const stdMargin = 30;

const getNodeById = (svg, id) => {
  if (svg.select("#" + id).empty()) {
    svg.append("g").attr("id", id);
  }
  return svg.select("#" + id)
}

const partition = (data) => {
  const root = d3.hierarchy(data).sum((d) => d.value);
   //      .sort((a, b) => b.value - a.value)
  //optional sort large to small
  return d3.partition().size([2 * Math.PI, root.height + 1])(root);
};

const arc = d3
  .arc()
  .startAngle((d) => d.x0)
  .endAngle((d) => d.x1)
  .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.01))
  .padRadius(radius * 1.5)
  .innerRadius((d) => d.y0 * radius)
  .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 2));

const smallArc = d3
  .arc()
  .startAngle((d) => d.x0)
  .endAngle((d) => d.x1)
  .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.01))
  .padRadius(radius * 1.5)
  .innerRadius((d) => d.y0 * radius * 0.1)
  .outerRadius((d) => Math.max(d.y0 * radius * 0.1, d.y1 * radius * 0.1 - 2));

function arcVisible(d) {
  return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
}

function labelVisible(d) {
  return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.2;
}

function labelTransform(d) {
  const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
  const y = ((d.y0 + d.y1) / 2) * radius;
  return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
}

function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 1,
      lineHeight = 0.8, // ems
      x = text.attr("x"),
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        lineNumber += 1
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

const format = () => d3.format(",d");

export function SunburstChart({ bridgeConditionData, chartID }) {
  const d3Container = useRef(null);

  useEffect(() => {

    const categoryColor = d3
          .scaleLinear()
          .domain([0, bridgeConditionData.children.length / 2, bridgeConditionData.children.length])
          .range(["#2C5C9A", "#c44436", "#2C5C9A"])
          .interpolate(d3.interpolateRgb.gamma(1));

    // Color translation - explicit mapping
    const categories = bridgeConditionData.children
          .map((d, i) => ({ name: d.name, value: i }))
          .reduce((acc, curr) => {
            acc[curr.name] = curr.value;
            return acc;
          }, {});

    const svg = d3.select(d3Container.current);

    const root = partition(bridgeConditionData);

    root.each((d) => (d.current = d));
    svg.style("font", "1.15rem sans-serif");
    svg.style("font-family", "Fira Sans");

    const sunburstNode = getNodeById(svg, "SunburstContainer")
    sunburstNode.select("#sunburst").remove();

    const locateNode = getNodeById(svg, "LocateContainer")
    locateNode.select("#locateSun").remove()

    const lg = locateNode
          .append("g")
          .attr("id", "locateSun")
          .attr("transform", `translate(${width / 12}, ${width / 12})`);

    const g = sunburstNode
          .append("g")
          .attr("id", "sunburst")
          .attr("transform", `translate(${width / 2}, ${width / 2})`);

    const opacityLevels = { 1: 1, 2: 0.8, 3: 0.6, 4: 0.4 };

    const path = g
          .append("g")
          .selectAll("path")
          .data(root.descendants().slice(1))
          .join("path")
          .attr("fill", (d) => {
            while (d.depth > 1) {
              d = d.parent;
            }
            if (d.depth === 1) {
              return categoryColor(categories[d.data.name])
            }
          })
          .attr("fill-opacity", (d, i) => {
            return arcVisible(d.current) ? opacityLevels[d.depth] : 0 }
               )
          .attr("d", (d) => arc(d.current));

    path
      .filter((d) => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    path.append("title").text(
      (d) =>
      `${d
            .ancestors()
            .map((d) => d.data.name)
            .reverse()
            .join(" / ")}\n${d.value}`
    );

    const lgpath = lg
          .append("g")
          .selectAll("path")
          .data(root.descendants().slice(1))
          .join("path")
          .attr("fill", (d) => {
            return "#000000"
          })
          .attr("fill-opacity", (d, i) => {
            return arcVisible(d.current) ? 1.0 : 0.2 }
               )
          .attr("d", (d) => smallArc(d.current));

    const label = g
          .append("g")
          .attr("id", "labels")
          .attr("pointer-events", "none")
          .attr("text-anchor", "middle")
          .style("user-select", "none")
          .selectAll("text")
          .data(root.descendants().slice(1))
          .join("text")
          .attr("dy", "0.35em")
          .attr("fill", (d) => {
            while (d.depth > 3) {
              d = d.parent;
            }
            if (d.depth <= 2) {
              return '#ffffff'
            } else {
              return '#000000'
            }
          })
          .attr("fill-opacity", (d) => +labelVisible(d.current))
          .attr("transform", (d) => labelTransform(d.current))
          .text((d) => d.data.name)
          .attr("id", "labelText")
          .call(wrap, radius - 10)

    const number = g.selectAll("#labelText")
          .data(root.descendants().slice(1))
          .join("text")
          .append("tspan")
          .attr("dy", "1.15em")
          .attr("x", 0)
          .text(d => d.value)
          .attr("font-size", "1.0em")
          .attr("font-weight","bold")

    const parent = g
          .append("circle")
          .datum(root)
          .attr("r", radius)
          .attr("fill", "none")
          .attr("pointer-events", "all")
          .on("click", clicked);

    function clicked(event, p) {
      parent.datum(p.parent || root);
      root.each(
        (d) => {
          return d.target = {
            x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth),
          }
        }
      );

      const t = g.transition().duration(750);

      path
        .transition(t)
        .tween("data", (d) => {
          const i = d3.interpolate(d.current, d.target);
          return (t) => (d.current = i(t));
        })
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", (d) =>
          arcVisible(d.target) ? opacityLevels[d.depth] : 0
        )
        .attrTween("d", (d) => () => arc(d.current));

      label
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        })
        .transition(t)
        .attr("fill-opacity", (d) => +labelVisible(d.target))
        .attrTween("transform", (d) => () => labelTransform(d.current));

      const lgt = lg.transition().duration(750);

      lgpath
        .transition(lgt)
        .attr("fill-opacity", (d) =>
          arcVisible(d.target) ? 1.0 : 0.2
        )
    }

    //add attribution
    const attrNode = getNodeById(svg, "AttributionContainer")
    attrNode.select("#attribution").remove();

    attrNode
      .attr(
        "transform",
        `translate(${0.7 * width}, ${height - stdMargin / 2})`
      )
      .raise()
      .append("g")
      .attr("id", "attribution")
      .append("text")
      .attr("stroke", "#d3d3d3")
      .append("svg:a")
      .attr("xlink:href", "https://twitter.com/eng_mclare")
      .text("www.bridge.watch @eng_mclare");
  }, [bridgeConditionData]);

return html`
    <${Grid} item xs=${12} sx=${{ paddingTop: 0 }}>
    <svg id=${chartID}
         viewBox="0 0 ${width} ${height}"
         ref=${d3Container}
  >
  </svg>
</${Grid}>
`;
}
