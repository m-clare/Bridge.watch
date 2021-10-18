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
        <${ListItem}>${field} minimum: ${objData.min}</${ListItem}>
        <${ListItem}>${field} maximum: ${objData.max}</${ListItem}>
        <${ListItem}>${field} average: ${objData.avg}</${ListItem}>
        <${ListItem}>${field} median: ${objData.median}</${ListItem}>
        <${ListItem}>${field} mode: ${objData.mode}</${ListItem}>
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
        <${ListItem}>${field} minimum: ${natData.min}</${ListItem}>
        <${ListItem}>${field} maximum: ${natData.max}</${ListItem}>
        <${ListItem}>${field} average: ${natData.avg}</${ListItem}>
        <${ListItem}>${field} median: ${natData.median}</${ListItem}>
        <${ListItem}>${field} mode: ${natData.mode}</${ListItem}>
        <${ListItem}>  </${ListItem}>
        </${List}>
      </div>`;
}
