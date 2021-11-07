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

export function HorizontalPropertyPanel({
  objSelected,
  objData,
  initialHistData,
  initialKeyData,
  field,
  plotHeight,
}) {
  let locality;
  if (objSelected) {
    locality = objData.countyName;
  } else {
    locality = "Selected State(s)";
  }

  const widthCheck = useMediaQuery("(min-width:900px)");

  let barHeight;
  if (widthCheck) {
    barHeight = 400;
  } else {
    barHeight = 300;
  }

  return html`
<${Grid} container spacing=${3}>
  <${Grid} item xs=${12}>
  <${Typography} variant="h5" component="h2">${locality}</${Typography}>
  </${Grid}>
  <${Grid} item style=${"padding-top: 0px"} xs=${12} md=${6}>
    <${Typography} variant="h6" component="h3">Histogram</${Typography}>
    <${BarChart}
      selected=${objSelected}
      objData=${objData.objHistogram}
      initialHistData=${initialHistData}
      barHeight=${barHeight}
      field=${field}
      />
  </${Grid}>
  <${Grid} item style=${"padding-top: 0px"} xs=${12} md=${6}>
    <${Typography} variant="h6" component="h3">Key Properties</${Typography}>
    <${HistTextSummary}
      selected=${objSelected}
      objData=${objData.objKeyValues}
      initialKeyData=${initialKeyData}
      field=${field}
      />
  </${Grid}>
</${Grid}>`;
}
