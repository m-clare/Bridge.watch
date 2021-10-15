import { h } from "preact";
import htm from "htm";
import { useEffect, useRef, useState } from "preact/hooks";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography"
import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { mesh } from "topojson-client";
import { legend } from "../colorLegend/index";
import us from "us-atlas/states-albers-10m.json";
import { isEmpty } from "lodash";
import { BarChart } from "../../components/barChart";
import { HexTextSummary } from "../../components/hexTextSummary";

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
  .translate([width * 0.5, height * 0.5])
const myHexbin = hexbin()
  .extent([
    [0, 0],
    [width, height],
  ])
  .radius(10);

const ratings = {
  3: 'Serious',
  9: 'Excellent'
}

// Color settings (initial hardcode for ratings data)
// potential color scales - numerical range, categorical, categorical/numerical

const ratingModeColor = d3
  .scaleLinear()
  .domain([3, 6, 9])
  .range(["red", "yellow", "green"])
  .interpolate(d3.interpolateRgb.gamma(2.2));

const barChartColor = d3
  .scaleLinear()
  .domain([0, 3, 6, 9, 10])
  .range(["darkred", "red", "yellow", "green", "darkgreen"])
  .interpolate(d3.interpolateRgb.gamma(2.2));

export function HexbinChart({ bridgeData }) {
  const [activeHex, setActiveHex] = useState({});
  const [totalValues, setTotalValues] = useState({});
  const [natData, setNatData] = useState({});
  const [hexSelected, setHexSelected] = useState(false);
  const [field, setField] = useState("  ");

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

  useEffect(() => {
    if (!isEmpty(bridgeData)) {
      setTotalValues(bridgeData.ratingValues);
      setNatData(bridgeData.natData);
      setField(bridgeData.field);
    }
  }, [bridgeData]);

  useEffect(() => {
    if (!isEmpty(bridgeData) && d3Container.current) {
      const svg = d3.select(d3Container.current);

      const hexBridge = {
        hexBin: bridgeData.hexBin,
        ratingValues: bridgeData.ratingValues,
      };

      const radius = d3.scaleSqrt(
        [0, d3.max(hexBridge.hexBin, (d) => d.count)],
        [0, myHexbin.radius() * Math.SQRT2]
      );

      // add legend
      svg
        .append("g")
        .attr("transform", `translate(${0.6 * width}, ${stdMargin})`)
        .append(() =>
          legend({
            color: ratingModeColor,
            width: width * 0.3,
            tickFormat: ".0f",
            tickSize: 0,
            ticks: 8,
            tickExtremes: [ratings[3], ratings[9]]
          })
        );

      // add hexes
      svg
        .append("g")
        .attr("id", "hexes")
        .selectAll("path")
        .data(hexBridge.hexBin)
        .join("path")
        .attr("class", "hex")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
        .attr("d", (d) => myHexbin.hexagon(d3.max([radius(d.count), 2])))
        .attr("fill", (d) => ratingModeColor(d.commonValue))
        .attr("stroke", (d) => d3.lab(ratingModeColor(d.commonValue)).darker())
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
  }, [bridgeData]);

  return html`
<${Grid} item container spacing=${2}>
  <${Grid} item xs=${12} sm=${8}>
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
  <${Grid} item xs=${12} sm=${4}>
    <${Paper} variant=${"outlined"} style=${"padding: 15px"}>
      <${Grid} item>
        <div>
          <${Typography} variant="h5" component="h2">${locality} Histogram</${Typography}>
          <${BarChart}
            selected=${hexSelected}
            objData=${activeHex.objHistogram}
            initialData=${totalValues}
            colorPalette=${barChartColor}
            barHeight=${barHeight}
            field=${field}
            />
        </div>
      </${Grid}>
      <${Grid} item>
        <${HexTextSummary}
          selected=${hexSelected}
          objData=${activeHex.objKeyValues}
          natData=${natData}
          field=${field[0].toUpperCase()}${field.slice(1)}
          />
      </${Grid}>
    </${Paper}>
  </${Grid}>
</${Grid}>
`;
}
