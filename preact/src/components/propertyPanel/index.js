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
import { legend } from "../colorLegend";
import us from "us-atlas/states-albers-10m.json";
import { isEmpty } from "lodash-es";
import { colorDict } from "../colorPalette";

import { BarChart } from "../../components/barChart";
import { HistTextSummary } from "../../components/histTextSummary";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import useMediaQuery from "@mui/material/useMediaQuery";
const html = htm.bind(h);

export function PropertyPanel({ hexSelected, objData, initialData, natData, field}) {

  let locality;
  if (hexSelected) {
    locality = "Selected Hex";
  } else {
    locality = "National";
  }

  const widthCheck = useMediaQuery("(min-width:900px)");

  let barHeight;
  if (widthCheck) {
    barHeight = 600;
  } else {
    barHeight = 300;
  }

  return html`
<${Grid} item xs=${12} md=${4} >
  <${Paper} style=${"padding: 24px; min-height: 580px"}> 
    <${Grid} item>
      <${Typography} variant="h5" component="h2">${locality} Histogram</${Typography}>
      <${BarChart}
        selected=${hexSelected}
        objData=${objData.objHistogram}
        initialData=${initialData}
        barHeight=${barHeight}
        field=${field}
        />
    </${Grid}>
    <${Grid} item>
      <${Typography} variant="h5" component="h2">${locality} Properties</${Typography}>
      <${HistTextSummary}
        selected=${hexSelected}
        objData=${objData.objKeyValues}
        natData=${natData}
        field=${field}
        />
    </${Grid}>
  </${Paper}>
</${Grid}>`
}
