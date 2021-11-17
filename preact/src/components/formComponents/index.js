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

const html = htm.bind(h)

export function singleSelect(plotChoices, queryState, submitted, handleSingleChange) {

return html`
  <${FormControl} fullWidth>
    <${InputLabel}>${plotChoices.label}</${InputLabel}>
    <${Select} value=${queryState[plotChoices.name]}
               label=${plotChoices.label}
               disabled=${submitted}
               onChange=${(e) => handleSingleChange(e, plotChoices.name)}
      >
      ${Object.keys(plotChoices.options).map((shortName, index) => {
      return html`<${MenuItem} key=${shortName}
                               value=${shortName}
                               >
        ${plotChoices.options[shortName].display}</${MenuItem}>`
      })};
    </${Select}>
  </${FormControl}>`
}

export function stateSingleSelect(stateChoices, queryState, submitted, handleSingleChange) {

return html`
  <${FormControl} fullWidth>
    <${InputLabel}>${stateChoices.label}</${InputLabel}>
    <${Select} value=${queryState[stateChoices.name]}
               label=${stateChoices.label}
               disabled=${submitted}
               onChange=${(e) => handleSingleChange(e, stateChoices.name)}
      >
      ${Object.keys(stateChoices.options).map((name, index) => {
      return html`<${MenuItem} key=${name}
                               value=${name}
                               >
        ${name}</${MenuItem}>`
      })};
    </${Select}>
  </${FormControl}>`
}

export function multiFilter(filter, queryState, formHandlers, required) {
  const handleChange = formHandlers.handleChange;
  const renderSubmitted = formHandlers.submitted;
  const handleClose = formHandlers.handleClose;

  return html`
  <${FormControl} required=${required} fullWidth>
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
`;
}
