import { h } from "preact";
import htm from "htm";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// form only imports...
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";

import { singleSelect, stateSingleSelect, multiFilter } from "../formComponents";

const html = htm.bind(h);


export function TopForm({
  queryState,
  handleChange,
  handleClose,
  handleSingleChange,
  submitted,
  plotChoices,
  stateChoices,
  filters,
  handleClick,
  colWidth
}) {
  const formHandlers = {};
  formHandlers.handleChange = handleChange;
  formHandlers.handleClose = handleClose;
  formHandlers.submitted = submitted;

  return html`
 <${Grid} container spacing=${3}>
   <${Grid} item xs=${12}>
     <${Typography}
       variant="h6"
       component="h2"
       color="${grey[500]}">
       <i>Choose two states</i>
     </${Typography}>
   </${Grid}>
   ${Object.keys(stateChoices).map((d) => (html`
    <${Grid} item xs=${12} md=${6} style=${"padding-top: 8px"}>
     ${stateSingleSelect(stateChoices[d], queryState, submitted, handleSingleChange)}
    </${Grid}>
   `))}
   <${Grid} item xs=${12}>
     <${Typography}
       variant="h6"
       component="h2"
       color="${grey[500]}">
       <i>Display Options</i>
     </${Typography}>
   </${Grid}>
   <${Grid} item xs=${12} md=${4} style=${"padding-top: 8px"}>
     ${singleSelect(plotChoices, queryState, submitted, handleSingleChange)}
   </${Grid}>
   <${Grid} item xs=${12}>
     <${Typography} variant="h6"
                    component="h2"
                    color="${grey[500]}">
       <i>Filters</i>
     </${Typography}>
   </${Grid}>
   ${filters.map((value) => html`
   <${Grid} item xs=${12} md=${colWidth.multi} style=${"padding-top: 8px"}>
     ${multiFilter(value, queryState, formHandlers, false)}
   </${Grid}>`)}
   <${Grid} item xs=${12} md=${colWidth.single}>
     <${Button} fullWidth disabled=${submitted}
                variant="contained"
                color="primary"
                onClick=${handleClick}>
       Clear filters
     </${Button}>
   </${Grid}>
 </${Grid}>
 `;
}
