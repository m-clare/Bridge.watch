import { h } from "preact";
import htm from "htm";
import { useEffect, useRef, useState } from "preact/hooks";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { mesh } from "topojson-client";
import { feature } from "topojson-client";
import { legend } from "../colorLegend";
import us from "us-atlas/counties-albers-10m.json";
import { isEmpty } from "lodash-es";
import { colorDict } from "../colorPalette";

import { BarChart } from "../../components/barChart";
import { HistTextSummary } from "../../components/histTextSummary";
import { HorizontalPropertyPanel } from "../../components/horizontalPropertyPanel";

import { stateOptions } from "../../components/options";

import useMediaQuery from "@mui/material/useMediaQuery";
const html = htm.bind(h);

// Constant values for scaling, aspectRatio, etc.
const width = 975;
const height = 975
const stdMargin = 30;

const getAttribution = (svg) => {
  if (!document.getElementById("attributionContainer")) {
    svg.append("g").attr("id", "attributionContainer");
  }
  return svg.select("#attributionContainer");
};

export function SunburstChart({ bridgeConditionData, field, submitted }) {
  const [totalValues, setTotalValues] = useState({});
  const d3Container = useRef(null);

  const svg = d3.select(d3Container.current);

  useEffect(() => {
    if (!isEmpty(bridgeConditionData)) {
      setTotalValues(bridgeConditionData);
    }
  }, [bridgeConditionData]);

  // useEffect(() => {
  //   if (!isEmpty(bridgeConditionData) && d3Container.current && !submitted) {
  //     setTitleSelected(displayStates.sort());
  //   }
  // }, [bridgeCountyData])

  useEffect(() => {
    if (!isEmpty(bridgeConditionData) && d3Container.current && !submitted) {
      const svg = d3.select(d3Container.current);
      const color = colorDict[plotType];

      //add attribution
      const attrNode = getAttribution(svg);
      attrNode.select("#attribution").remove();

      attrNode
        .attr(
          "transform",
          `translate(${0.7 * width}, ${height - stdMargin - 20})`)
        .raise()
        .append("g")
        .attr("id", "attribution")
        .append("text")
        .attr("stroke", "#d3d3d3")
        .append("svg:a")
        .attr("xlink:href", "https://twitter.com/eng_mclare")
        .text("www.bridge.watch @eng_mclare");
    } 
  }, [bridgeConditionData, plotType]);

  return html`
    ${!isEmpty(bridgeConditionData)
      ? html`<${Grid} item xs=${12}>
    <${Typography} variant="h4" component="h1">Sunburst Plot</${Typography}>
    </${Grid}>
    <${Grid} item xs=${12} sx=${{ paddingTop: 0 }}>
    <svg class="d3-component"
         viewBox="0 0 ${width} ${height}"
         ref=${d3Container}
         >
    </svg>
    </${Grid}>`
    : null}
    `;
}
    
