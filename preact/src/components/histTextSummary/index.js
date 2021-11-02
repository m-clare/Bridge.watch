import { h } from "preact";
import htm from "htm";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
const html = htm.bind(h);

export function HistTextSummary({ selected, objData, natData, field }) {

  let data;
  if (selected) {
    data = objData
  } else {
    data = natData
  }
  field = field.replace(/_/g, ' ');
  return html`
      <div style=${"min-height: 200px"}>
        <${List} dense=${true}>
        <${ListItem}>Number of Bridges: ${data.count}</${ListItem}>
        <${ListItem}>${field} minimum: ${data.min}</${ListItem}>
        <${ListItem}>${field} maximum: ${data.max}</${ListItem}>
        <${ListItem}>${field} average: ${Math.round(data.avg)}</${ListItem}>
        <${ListItem}>${field} median: ${data.median}</${ListItem}>
        <${ListItem}>${field} mode: ${data.mode}</${ListItem}>
        <${ListItem}>
         ${selected ? 
          html`Center Coordinate: ${data.hexLocation[1]}°N, ${-data.hexLocation[0]}°W` : null}
        </${ListItem}>
        </${List}>
    </div>
    `;
  } 
