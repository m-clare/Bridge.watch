import { h } from "preact";
import htm from "htm";
import { useEffect, useRef, useState } from "preact/hooks";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { mesh } from "topojson-client";
import { legend } from "../colorLegend";
import us from "us-atlas/states-albers-10m.json";
import { isEmpty } from "lodash-es";
import { colorDict } from "../colorPalette";

import { BarChart } from "../../components/barChart";
import { HistTextSummary } from "../../components/histTextSummary";
import { VerticalPropertyPanel } from "../../components/verticalPropertyPanel";

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
  rating: ["Failed", "Excellent"],
  percent_poor: ["None in poor condition (%)", "All in poor condition (%)"],
  year_built: [1900, 2021],
  repair_cost_per_foot: ["$1,000", "$100,000"]

};

const getInterestValue = (plotType, hexValues) => {
  if (plotType === "percent_poor") {
    const histogram = hexValues.objHistogram;
    const numPoor =
      histogram[0].count +
      histogram[1].count +
      histogram[2].count +
      histogram[3].count +
      histogram[4].count;
    return Math.round((numPoor / hexValues.count) * 100);
  } else {
    return hexValues.objKeyValues.median;
  }
};

const getHexSize = (hexSize, radius, count) => {
  if (hexSize) {
    return d3.max([radius(count), 2]);
  } else {
    return 10;
  }
};

const getRadius = (hexBin) => {
  return d3.scaleSqrt(
    [0, d3.max(hexBin, (d) => d.count)],
    [0, myHexbin.radius() * Math.SQRT2]
  );
};

export function HexbinChart({ bridgeData, plotType, submitted }) {
  const [activeHex, setActiveHex] = useState({});
  const [totalValues, setTotalValues] = useState({});
  const [hexSelected, setHexSelected] = useState(false);
  const [hexSize, setHexSize] = useState(true);

  const d3Container = useRef(null);

  const widthCheck = useMediaQuery("(min-width:600px)");

  const handleSwitchChange = (event) => {
    setHexSize(!hexSize);
  };

  let plotHeight;
  if (widthCheck) {
    plotHeight = "600px";
  } else {
    plotHeight = "0px";
  }

  let locality;
  if (hexSelected) {
    locality = "Selected Hex";
  } else {
    locality = "National Bridge";
  }

  useEffect(() => {
    if (!isEmpty(bridgeData) && !submitted) {
      setTotalValues(bridgeData.totalValues);
    }
  }, [bridgeData]);

  useEffect(() => {
    if (!isEmpty(bridgeData) && d3Container.current && !submitted) {
      const svg = d3.select(d3Container.current);

      const hexBridge = {
        hexBin: bridgeData.hexBin,
        totalValues: bridgeData.totalValues,
      };

      const radius = getRadius(hexBridge.hexBin);

      const color = colorDict[plotType];

      const getLegend = () => {
        if (!document.getElementById("legendContainer")) {
          svg.append("g").attr("id", "legendContainer");
        }
        return svg.select("#legendContainer");
      };

      const legendNode = getLegend();
      legendNode.select("#legend").remove();

      legendNode
        .attr("transform", `translate(${0.6 * width}, ${stdMargin - 10})`)
        .append(() =>
          legend({
            color: color,
            width: width * 0.3,
            tickFormat: ".0f",
            tickSize: 0,
            ticks: 8,
            tickExtremes: tickExtremes[plotType],
          })
        );

      const getHex = () => {
        if (!document.getElementById("hexes")) {
          svg.append("g").attr("id", "hexes");
        }
        return svg.select("#hexes");
      };
      const hexNode = getHex();

      const hexBool = hexSize;

      // add hexes
      hexNode
        .selectAll("path")
        .data(hexBridge.hexBin)
        .join("path")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
        .attr("d", (d) =>
          myHexbin.hexagon(getHexSize(hexBool, radius, d.count))
        )
        .attr("fill", (d) => color(getInterestValue(plotType, d)))
        .attr("stroke", (d) =>
          d3.lab(color(getInterestValue(plotType, d))).darker()
        )
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
              myHexbin.hexagon(d3.max([radius(d.count) * 1.5, 15]))
            )
            .attr("stroke-width", "0.2em");
        })
        .on("mouseout", function (d) {
          setHexSelected(false);
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", (d) =>
              myHexbin.hexagon(getHexSize(hexBool, radius, d.count))
            )
            .attr("stroke-width", "0.1em");
        });
    }
  }, [bridgeData, hexSize, plotType]);

  return html`
<${Grid} item container spacing=${3}>
  <${Grid} item xs=${12} md=${8}>
    <${Paper} sx=${{padding: 3, minHeight: {sx: 0, md: 600}}}>
    <${FormControlLabel}
      control=${html`<${Switch}
        defaultChecked
        checked=${hexSize}
        onChange=${handleSwitchChange}
        inputProps=${{ "aria-label": "controlled" }}
      />`}
      label="Scaled hex area"/>
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
</${Paper}>
  </${Grid}>
  <${VerticalPropertyPanel} objSelected=${hexSelected}
                    objData=${activeHex}
                    initialHistData=${totalValues}
                    initialKeyData=${bridgeData.keyData}
                    field=${bridgeData.field}
                    />
</${Grid}>`;
}
