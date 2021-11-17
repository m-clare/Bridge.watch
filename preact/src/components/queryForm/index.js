import { h } from "preact";
import htm from "htm";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// form only imports...
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";

import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";

import { singleSelect, multiFilter } from "../formComponents";

const html = htm.bind(h);

export function QueryForm({
  queryState,
  handleChange,
  handleClose,
  handleSingleChange,
  submitted,
  plotChoices,
  filters,
  handleClick,
  colWidth,
}) {
  const formHandlers = {};
  formHandlers.handleChange = handleChange;
  formHandlers.handleClose = handleClose;
  formHandlers.submitted = submitted;

  const multiFilters = Object.values(
    (({ material, type, service }) => ({ material, type, service }))(filters)
  );

  let stateValue = false;
  let stateFilter;
  if ("state" in filters) {
    stateValue = true;
    stateFilter = Object.values((({ state }) => ({ state }))(filters));
  }
  filters = Object.values(multiFilters);
  return html`
 ${
   stateValue
     ? html`
<${Grid} item xs=${12}>
  <${Typography}
    variant="h6"
    component="h2"
    color="${grey[500]}">
    <i>States</i>
  </${Typography}>
</${Grid}>
${stateFilter.map(
(value) => html`
<${Grid} item xs=${12} md=${colWidth.multi} style=${"padding-top: 8px"}>
  ${multiFilter(value, queryState, formHandlers, true)}
</${Grid}>`
)}`
: null
}
<${Grid} item xs=${12}>
  <${Typography}
    variant="h6"
    component="h2"
    color="${grey[500]}">
    <i>Display Options</i>
  </${Typography}>
</${Grid}>
<${Grid} item xs=${12} md=${colWidth.single} style=${"padding-top: 8px"}>
  ${singleSelect(plotChoices, queryState, submitted, handleSingleChange)}
</${Grid}>
<${Grid} item xs=${12}>
  <${Typography} variant="h6"
                 component="h2"
                 color="${grey[500]}">
    <i>Filters</i>
  </${Typography}>
</${Grid}>
${filters.map(
(value) => html`
<${Grid} item xs=${12} md=${colWidth.multi} style=${"padding-top: 8px"}>
  ${multiFilter(value, queryState, formHandlers, false)}
</${Grid}>`
)}
<${Grid} item xs=${12} md=${colWidth.single}>
  <${Button} fullWidth disabled=${submitted} variant="contained" color="primary" onClick=${handleClick}>Clear filters</${Button}>
</${Grid}>
`;
}
