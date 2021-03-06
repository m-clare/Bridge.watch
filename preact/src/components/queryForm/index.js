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
import { handleClearFiltersClick, handleClearAllFiltersClick } from "../helperFunctions"
import { singleSelect, multiFilter } from "../formComponents";

const html = htm.bind(h);

export function QueryForm({
  stateInfo,
  plotChoices,
  filters,
  colWidth,
}) {
  const multiFilters = Object.values(
    (({ material, type, service, service_under }) => ({ material, type, service, service_under }))(filters)
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
  ${multiFilter(value, stateInfo, true)}
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
  ${singleSelect(plotChoices, stateInfo)}
</${Grid}>
<${Grid} item container spacing=${3} xs=${12}>
<${Grid} item xs=${12}>
  <${Typography} variant="h6"
                 component="h2"
                 color="${grey[500]}">
    <i>Basic Filters</i>
  </${Typography}>
</${Grid}>
${filters.map(
(value) => html`
<${Grid} item xs=${12} md=${colWidth.multi} style=${"padding-top: 8px"}>
    ${multiFilter(value, stateInfo, false)}
</${Grid}>`
)}
</${Grid}>
<${Grid} item container spacing=${3} xs=${12}>
<${Grid} item xs=${12} md=${colWidth.single}>
  <${Button} fullWidth disabled=${stateInfo.submitted} variant="contained" color="primary" onClick=${(e) => handleClearFiltersClick(e, stateInfo)}>Clear basic filters</${Button}>
</${Grid}>
<${Grid} item xs=${12} md=${colWidth.single}>
  <${Button} fullWidth disabled=${stateInfo.submitted} variant="contained" color="primary" onClick=${(e) => handleClearAllFiltersClick(e, stateInfo)}>Clear all filters</${Button}>
</${Grid}>
</${Grid}>
`;
}
