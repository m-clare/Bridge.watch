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

const html = htm.bind(h);

function singleSelect(plotOptions, queryState, submitted, handleSingleChange) {

return html`

<${Grid} item xs=${12} md=${4} style=${"padding-top: 8px"}>
  <${FormControl} sx=${{ minWidth: 240}} fullWidth>
    <${InputLabel}>Plot Type</${InputLabel}>
    <${Select} value=${queryState.plot_type}
               label="Plot Type"
               disabled=${submitted}
               onChange=${(e) => handleSingleChange(e, 'plot_type')}
      >
      ${Object.keys(plotOptions).map((name, index) => {
      return html`<${MenuItem} key=${name}
                               value=${name}
                               >
        ${plotOptions[name].display}</${MenuItem}>`
      })};
    </${Select}>
  </${FormControl}>
</${Grid}>`
}

function multiFilter(filter, queryState, formHandlers, colWidth) {
  const handleChange = formHandlers.handleChange;
  const renderSubmitted = formHandlers.submitted;
  const handleClose = formHandlers.handleClose;

  return html`<${Grid} item xs=${12} md=${colWidth} style=${"padding-top: 8px"}>
  <${FormControl} sx=${{ minWidth: 240 }} fullWidth>
    <${InputLabel}>${filter.label}</${InputLabel}>
    <${Select}
      value=${queryState[filter.name]}
      label=${filter.name}
      onChange=${(e) => handleChange(e, filter.name)}
      onClose=${handleClose}
      multiple
      disabled=${renderSubmitted}
      input=${html`<${OutlinedInput}
        id="select-multiple-chip"
        label=${filter.label}
      />`}
      renderValue=${(selected) =>
        html`<${Box} sx=${{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        ${selected.map(
          (value) => html`<${Chip} key=${value} label=${value} />`
        )}
      </${Box}>`}
      >
      ${Object.keys(filter.options).map((name, index) => {
        return html`<${MenuItem} dense value=${name}>${name}</${MenuItem}>`;
      })};
    </${Select}>
  </${FormControl}>
</${Grid}>`;
}

export function QueryForm({
  queryState,
  handleChange,
  handleClose,
  handleSingleChange,
  submitted,
  plotOptions,
  filters
}) {
  const formHandlers = {};
  formHandlers.handleChange = handleChange;
  formHandlers.handleClose = handleClose;
  formHandlers.submitted = submitted;

  filters = Object.values(filters)
  const colWidth = Math.max(4, Math.round(12 / filters.length));

  return html`
 <${Grid} item xs=${12}>
                  <${Typography} 
                    variant="h6"
                    component="h2"
                    color="${grey[500]}">
                    <i>Display Options</i>
                  </${Typography}>
                </${Grid}>
 ${singleSelect(plotOptions, queryState, submitted, handleSingleChange)}
  <${Grid} item xs=${12}>
    <${Typography} variant="h6"
                   component="h2"
                   color="${grey[500]}">
      <i>Filters</i>
    </${Typography}>
  </${Grid}>
  ${filters.map((value) => multiFilter(value, queryState, formHandlers, colWidth))}
  `;
}
