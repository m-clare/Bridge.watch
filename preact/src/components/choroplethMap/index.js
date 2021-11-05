import { h } from "preact";
import htm from "htm";
import { useEffect, useRef, useState } from "preact/hooks";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

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
import { PropertyPanel } from "../../components/propertyPanel";

import { stateOptions } from "../../components/Options";

import useMediaQuery from "@mui/material/useMediaQuery";
const html = htm.bind(h);

// Constant values for scaling, aspectRatio, etc.
const width = 975;
const height = 610;
const scaleValue = 1300;
const stdMargin = 30;


const tickExtremes = {
  rating: ["Failed", "Excellent"],
  percent_poor: ["None in poor condition (%)", "All in poor condition (%)"],
  year_built: [1900, 2021],
  repair_cost_per_foot: ["$1,000", "$100,000"],
};

const getInterestValue = (plotType, countyValues) => {
  if (plotType === "percent_poor") {
    const histogram = countyValues.objHistogram;
    const numPoor =
      histogram[0].count +
      histogram[1].count +
      histogram[2].count +
      histogram[3].count +
      histogram[4].count;
    return Math.round((numPoor / countyValues.count) * 100);
  } else {
    return countyValues.objKeyValues.median;
  }
};

function getSelectedStates(states, us) {
  // deep copy object to avoid overwriting it
  const newStates = JSON.parse(JSON.stringify(us))
  newStates.objects.states.geometries = newStates.objects.states.geometries.filter(function(d){
    return states.includes(d.id.slice(0,2));
  })
  newStates.objects.counties.geometries = newStates.objects.counties.geometries.filter(function(d) {
    return states.includes(d.id.slice(0, 2))
  })
  return newStates;
}

const getCountyNode = (svg) => {
  if (!document.getElementById("Counties")) {
    svg.append("g").attr("id", "Counties");
  }
  return svg.select("#Counties");
};

export function ChoroplethMap({ bridgeCountyData, displayStates, plotType }) {
  const [activeCounty, setActiveCounty] = useState({})
  const [totalValues, setTotalValues] = useState({})
  const [countySelected, setCountySelected] = useState(false);
  const d3Container = useRef(null);

  const svg = d3.select(d3Container.current)

  useEffect(() => {
    if (!isEmpty(bridgeCountyData)) {
      setTotalValues(bridgeCountyData.totalValues);
    }
  }, [bridgeCountyData]);

  useEffect(() => {
    if (!isEmpty(bridgeCountyData) && d3Container.current) {
      const svg = d3.select(d3Container.current)

      const color = colorDict[plotType]

      const fipsStates = displayStates.map((d) => stateOptions[d]);
      const selectedStates = getSelectedStates(fipsStates, us)

      const selectedCounties = feature(selectedStates,  selectedStates.objects.counties);
      const projection = d3
            .geoIdentity()
            .fitExtent(
              [[stdMargin, stdMargin], [width - stdMargin, height - stdMargin]],
              selectedCounties
            );
      const path = d3.geoPath(projection);

      const countyBin = bridgeCountyData.countyBin.reduce((acc, curr) => ({...acc, [curr.fips]: curr}), {})
      console.log(countyBin)
      console.log(selectedCounties.features)

      const id = selectedCounties.features[0].id
      console.log(id)
      const test = getInterestValue(plotType, countyBin[id])
      console.log(countyBin[id])
      console.log(color(test))

      const svgCounties = getCountyNode(svg)
      svgCounties
        .selectAll("path")
        .data(selectedCounties.features)
        .join("path")
        .attr("fill", d => color(getInterestValue(plotType, countyBin[d.id])))
        .attr("d", path)

      svgCounties
        .join("path")
        .datum(mesh(us, us.objects.counties, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

    } else if (displayStates.length === 0) {
      const svg = d3.select(d3Container.current)
      const svgCounties = getCountyNode(svg)
      svg.remove(svgCounties)
    }
  }, [bridgeCountyData, plotType]);

  // useEffect(() => {
    // if (!isEmpty(bridgeCountyData)) {
      // setTotalValues(bridgeCountyData.totalValues);
    // }
  // }, [bridgeCountyData]);

  // useEffect(() => {
  //   if (!isEmpty(bridgeCountyData) && d3Container.current) {
  //     const svg = d3.select(d3Container.current);
  //   }
  // }, [bridgeCountyData, plotType]);

  return html`
  <${Grid} item xs=${12}>
    <svg class="d3-component"
       viewBox="0 0 ${width} ${height}"
       ref=${d3Container}
    >
  </svg>
  </${Grid}>
  <${Grid} item xs=${12}>
  </${Grid}>
`;
}
