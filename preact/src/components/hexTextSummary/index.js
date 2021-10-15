import { h } from "preact";
import htm from "htm";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
const html = htm.bind(h);

export function HexTextSummary({ selected, objData, natData, field }) {
  // state needs to be used because objData may be empty to start
  if (selected) {
    return html`
      <div style=${"min-height: 220px"}>
        <${Typography} variant="h5" component="h2">Selected Hex Properties</${Typography}> 
        <${List} dense=${true}>
        <${ListItem}>Number of Bridges: ${objData.count}</${ListItem}>
        <${ListItem}>${field} Minimum: ${objData.min}</${ListItem}>
        <${ListItem}>${field} Maximum: ${objData.max}</${ListItem}>
        <${ListItem}>${field} Average: ${objData.avg}</${ListItem}>
        <${ListItem}>${field} Median: ${objData.median}</${ListItem}>
        <${ListItem}>${field} Mode: ${objData.mode}</${ListItem}>
        <${ListItem}>
          Center Coordinate: ${objData.hexLocation[1]}°N, ${-objData.hexLocation[0]}°W
        </${ListItem}>
        </${List}>
    </div>
    `;
  } else
    return html`
      <div style=${"min-height: 220px"}>
        <${Typography} variant="h5" component="h2">National Bridge Properties</${Typography}>
        <${List} dense=${true}>
        <${ListItem}>Number of Bridges: ${natData.count}</${ListItem}>
        <${ListItem}>${field} Minimum: ${natData.min}</${ListItem}>
        <${ListItem}>${field} Maximum: ${natData.max}</${ListItem}>
        <${ListItem}>${field} Average: ${natData.avg}</${ListItem}>
        <${ListItem}>${field} Median: ${natData.median}</${ListItem}>
        <${ListItem}>${field} Mode: ${natData.mode}</${ListItem}>
        <${ListItem}>  </${ListItem}>
        </${List}>
      </div>`;
}
