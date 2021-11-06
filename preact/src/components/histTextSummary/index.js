import { h } from "preact";
import htm from "htm";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { plotOptions } from "../options";
const html = htm.bind(h);

export function HistTextSummary({ selected, objData, initialKeyData, field }) {

  let data;
  if (selected) {
    data = objData
  } else {
    data = initialKeyData
  }
  const fieldDisplay = plotOptions[field]['histogram'];
  return html`
        <${List} dense=${true}>
        <${ListItem}>Number of Bridges: ${data.count}</${ListItem}>
        <${ListItem}>${fieldDisplay} minimum: ${Math.round(data.min)}</${ListItem}>
        <${ListItem}>${fieldDisplay} maximum: ${Math.round(data.max)}</${ListItem}>
        <${ListItem}>${fieldDisplay} average: ${Math.round(data.avg)}</${ListItem}>
        <${ListItem}>${fieldDisplay} median: ${Math.round(data.median)}</${ListItem}>
        <${ListItem}>${fieldDisplay} mode: ${Math.round(data.mode)}</${ListItem}>
        <${ListItem}>
         ${(selected && data.hexLocation) ? 
          html`Center Coordinate: ${data.hexLocation[1]}°N, ${-data.hexLocation[0]}°W` : null}
        </${ListItem}>
        </${List}>
    `;
  } 
