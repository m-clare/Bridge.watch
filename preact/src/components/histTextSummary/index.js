import { h } from "preact";
import htm from "htm";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { plotOptions, monthNames } from "../options";
const html = htm.bind(h);

const display_info = {
  min: "minimum",
  max: "maximum",
  avg: "average",
  median: "median",
  mode: "mode",
  count: "count"
};

function getListItem(key, data, field) {
  if (field === "Inspection date") {
    return html`<${ListItem}>
    ${field} ${display_info[key]}: ${monthNames[data[key].getUTCMonth()]}-${data[key].getUTCFullYear()}
    </${ListItem}>`
  } else {
    return html`<${ListItem}>
  ${field} ${display_info[key]}: ${Math.round(data[key])}
  </${ListItem}>`
  }
}
export function HistTextSummary({ selected, objData, initialKeyData, field }) {
  let data;
  if (selected) {
    data = objData;
  } else {
    data = initialKeyData;
  }

  const display_info = {
    min: "minimum",
    max: "maximum",
    avg: "average",
    median: "median",
    mode: "mode",
    count: "count"
  };

  let {count, hexLocation, ...rest} = data

  const fieldDisplay = plotOptions[field]["histogram"];
  return html`
<${List} dense=${true}>
  <${ListItem}>Number of Bridges: ${data.count}</${ListItem}>
  ${Object.keys(rest).map(d => (getListItem(d, data, fieldDisplay)))}
  ${(selected && data.hexLocation) ? 
  html`
  <${ListItem}>
    Center Coordinate: ${data.hexLocation[1]}°N, ${-data.hexLocation[0]}°W
  </${ListItem}>` : null}
</${List}>
  `;
}
