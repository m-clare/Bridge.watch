import { h } from "preact";
import htm from "htm";
import { useEffect, useRef, useState } from "preact/hooks";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import * as d3 from "d3";

import { PanelBarChart } from "../../components/panelBarChart";
import { HistTextSummary } from "../../components/histTextSummary";

import useMediaQuery from "@mui/material/useMediaQuery";
const html = htm.bind(h);

export function VerticalPropertyPanel({
  objSelected,
  objData,
  initialHistData,
  initialKeyData,
  field,
}) {
  let locality;
  if (objSelected) {
    locality = "Selected Hex";
  } else {
    locality = "National";
  }

  const widthCheck = useMediaQuery("(min-width:1200px)");

  let barHeight;
  if (widthCheck) {
    barHeight = 600;
  } else {
    barHeight = 300;
  }

  return html`
  <${Paper} sx=${{ padding: [2,3], minHeight: { xs: 0, md: 600 }, width: "100%"}}> 
    <${Grid} item xs=${12}>
      <${Typography} variant="h5" component="h2">${locality} Histogram</${Typography}>
      <${PanelBarChart}
        selected=${objSelected}
        objData=${objData.objHistogram}
        initialHistData=${initialHistData}
        barHeight=${barHeight}
        field=${field}
        />
    </${Grid}>
    <${Grid} item xs=${12}>
      <${Typography} variant="h5" component="h2">${locality} Properties</${Typography}>
      <${HistTextSummary}
        selected=${objSelected}
        objData=${objData.objKeyValues}
        initialKeyData=${initialKeyData}
        field=${field}
        />
    </${Grid}>
  </${Paper}>`;
}
