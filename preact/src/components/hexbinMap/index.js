import { h } from "preact";
import htm from "htm";
import { useEffect, useRef, useState } from "preact/hooks";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { mesh } from "topojson-client";
import { legend } from "../colorLegend/index";
import us from "us-atlas/states-albers-10m.json";
import { isEmpty } from "lodash";
import { BarChart } from "../../components/barChart";
import { HexTextSummary } from "../../components/hexTextSummary";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import useMediaQuery from "@mui/material/useMediaQuery";
const html = htm.bind(h);

// Constant values for scaling, aspectRatio, etc.
const width = 975;
const height = 610;
const scaleValue = 1300;
const stdMargin = 30;

// d3 helper functions for mapping
const projection = d3
  .geoAlbersUsa()
  .scale(scaleValue)
  .translate([width * 0.5, height * 0.5]);
const myHexbin = hexbin()
  .extent([
    [0, 0],
    [width, height],
  ])
  .radius(10);

const tickExtremes = {
  "rating": ["Failed", "Excellent"],
  "year_built": [],
}

// Color settings (initial hardcode for ratings data)
// potential color scales - numerical range, categorical, categorical/numerical

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
  ratingCB: ratingColorblind,
  "year_built": yearBuiltColor,
};

export function HexbinChart({ bridgeData }) {
  const [activeHex, setActiveHex] = useState({});
  const [totalValues, setTotalValues] = useState({});
  const [hexSelected, setHexSelected] = useState(false);
  const [colorPalette, setColorPalette] = useState("rating");
  const [cbEnabled, setCbEnabled] = useState(false);

  const d3Container = useRef(null);

  const widthCheck = useMediaQuery("(min-width:600px)");

  let barHeight;
  if (widthCheck) {
    barHeight = 600;
  } else {
    barHeight = 300;
  }

  let locality;
  if (hexSelected) {
    locality = "Selected Hex";
  } else {
    locality = "National Bridge";
  }

  const togglePalette = () => setCbEnabled(!cbEnabled);

  /* useEffect(() => {
   *   if (cbEnabled) {
   *     setColorPalette("rating")
   *   } else {
   *     setColorPalette("ratingCB")
   *   }
   *   console.log(cbEnabled);
   *   console.log(colorPalette);
   * }, [togglePalette]) */

  useEffect(() => {
    if (!isEmpty(bridgeData)) {
      setTotalValues(bridgeData.totalValues);
    }
  }, [bridgeData]);

  useEffect(() => {
    if (!isEmpty(bridgeData)) {
      setColorPalette(bridgeData.field);
    }
  }, [bridgeData]);

  useEffect(() => {
    if (!isEmpty(bridgeData) && d3Container.current) {
      console.log(bridgeData.field)
      console.log(colorPalette)

      const svg = d3.select(d3Container.current);

      const hexBridge = {
        hexBin: bridgeData.hexBin,
        totalValues: bridgeData.totalValues,
      };

      const radius = d3.scaleSqrt(
        [0, d3.max(hexBridge.hexBin, (d) => d.count)],
        [0, myHexbin.radius() * Math.SQRT2]
      );

      const color = colorDict[colorPalette];

      const getLegend = () => {
        if (!document.getElementById("legendContainer")) {
          svg.append("g").attr("id", "legendContainer");
        }
        return svg.select("#legendContainer");
      };

      const legendNode = getLegend();
      //TODO:  add legend only once... probe this further
      legendNode
        .select('#legend')
        .remove()

      legendNode
        .attr("transform", `translate(${0.6 * width}, ${stdMargin})`)
        .append(() =>
          legend({
            color: color,
            width: width * 0.3,
            tickFormat: ".0f",
            tickSize: 0,
            ticks: 8,
            tickExtremes: tickExtremes[bridgeData.field],
          })
        );

      const getHex = () => {
        if (!document.getElementById("hexes")) {
          svg.append("g").attr("id", "hexes");
        }
        return svg.select("#hexes");
      };
      const hexNode = getHex();

      // add hexes
      hexNode
        .selectAll("path")
        .data(hexBridge.hexBin)
        .join("path")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
        .attr("d", (d) => myHexbin.hexagon(d3.max([radius(d.count), 2])))
        .attr("fill", (d) => color(d.commonValue))
        .attr("stroke", (d) => d3.lab(color(d.commonValue)).darker())
        .attr("stroke-width", "0.1em")
        .on("mouseover", function (d) {
          // Set state to pass to barChart
          let data = d3.select(this).data()[0];
          setActiveHex(data);
          setHexSelected(true);
          d3.select(this)
            .raise()
            .transition()
            .duration(200)
            .attr("d", (d) =>
              myHexbin.hexagon(d3.max([radius(d.count) * 1.5, 12]))
            )
            .attr("stroke-width", "0.2em");
        })
        .on("mouseout", function (d) {
          setHexSelected(false);
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", (d) => myHexbin.hexagon(d3.max([radius(d.count), 2])))
            .attr("stroke-width", "0.1em");
        });
    }
  }, [bridgeData, colorPalette]);

  return html`
<${Grid} item container spacing=${2}>
  <${Grid} item xs=${12} sm=${8}>
   <${Grid} container>
    <${Grid} item>
    <${FormGroup}>
      <${FormControlLabel} style=${"font-variant: small-caps"}
                           control=${html`<${Switch}
                             checked=${cbEnabled}
                             onChange=${togglePalette}
                           />`} label="Colorblind palette" />
    </${FormGroup}>
    </${Grid}>
    <${Grid} item>
    <svg
      class="d3-component"
      viewBox="0 0 ${width} ${height}"
      ref=${d3Container}
      >
      <path
        fill="none"
        transform="translate(0, 0)"
        stroke="#777"
        stroke-width="0.5"
        stroke-linejoin="round"
        d=${d3.geoPath()(mesh(us, us.objects.states))}
        />
    </svg>
     </${Grid}>
    </${Grid}>
  </${Grid}>
  <${Grid} item xs=${12} sm=${4}>
    <${Paper} variant=${"outlined"} style=${"padding: 15px"}>
      <${Grid} item>
        <div>
          <${Typography} variant="h5" component="h2">${locality} Histogram</${Typography}>
          <${BarChart}
            selected=${hexSelected}
            objData=${activeHex.objHistogram}
            initialData=${totalValues}
            colorPalette=${colorDict[colorPalette]}
            barHeight=${barHeight}
            field=${bridgeData.field}
            />
        </div>
      </${Grid}>
      <${Grid} item>
        <${HexTextSummary}
          selected=${hexSelected}
          objData=${activeHex.objKeyValues}
          natData=${bridgeData.natData}
          field=${bridgeData.field[0].toUpperCase()}${bridgeData.field.slice(1)}
          />
      </${Grid}>
    </${Paper}>
  </${Grid}>
</${Grid}>
  `;
}
