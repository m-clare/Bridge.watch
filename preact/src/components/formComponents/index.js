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
import TextField from "@mui/material/TextField";
import { helperText } from "../options";
const html = htm.bind(h);
import { handleChange, handleClose, handleDetailedChange, handleSingleChange, handleRangeChange } from "../helperFunctions";

export function singleSelect(
  plotChoices,
  stateInfo
) {
  const { queryState } = stateInfo
  return html`
  <${FormControl} fullWidth>
    <${InputLabel}>${plotChoices.label}</${InputLabel}>
    <${Select} value=${queryState[plotChoices.name]}
               label=${plotChoices.label}
               disabled=${stateInfo.submitted}
               onChange=${(e) => handleSingleChange(e, plotChoices.name, stateInfo)}
      >
      ${Object.keys(plotChoices.options).map((shortName, index) => {
        return html`<${MenuItem} key=${shortName}
                               value=${shortName}
                               >
        ${plotChoices.options[shortName].display}</${MenuItem}>`;
      })};
    </${Select}>
  </${FormControl}>`;
}

export function stateSingleSelect(
  stateChoices,
  queryState,
  submitted,
  handleSingleChange
) {
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
        ${name}</${MenuItem}>`;
      })};
    </${Select}>
  </${FormControl}>`;
}

export function multiFilter(filter, stateInfo, required) {
  const { queryState, submitted } = stateInfo

  return html`
  <${FormControl} required=${required} fullWidth>
    <${InputLabel}>${filter.label}</${InputLabel}>
    <${Select}
      value=${queryState[filter.name]}
      label=${filter.name}
      onChange=${(e) => handleChange(e, filter.name, stateInfo)}
      onClose=${(e) => handleClose(e, stateInfo)}
      multiple
      disabled=${submitted}
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

export function multiDetailedFilter(filter, stateInfo, required) {
  const { detailedQueryState, submitted } = stateInfo
  return html`
<${FormControl} required=${required} fullWidth>
    <${InputLabel}>${filter.label}</${InputLabel}>
    <${Select}
      value=${detailedQueryState[filter.name]}
      label=${filter.name}
      onChange=${(e) => handleDetailedChange(e, filter.name, stateInfo)}
      multiple
      disabled=${submitted}
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

export function yearRangeFilter(
  stateInfo
) {
  const { detailedQueryState, submitted, validRange } = stateInfo
  return html`
<${Box} sx=${{
    display: "flex",
    alignItems: "center",
    "& > :not(style)": { m: 1 },
  }}>
<${TextField} id="year-min"
              value=${detailedQueryState.rangeFilters.year_built.min}
              disabled=${submitted}
              onBlur=${(e) =>
                handleRangeChange(e, "year_built", stateInfo, "min")}
              label="Minimum"
              type="number"
              helperText=" "
              inputProps=${{
                inputMode: "numeric",
                min: 1697,
                max: 2021,
                pattern: "[1,2][0-9]{3}",
              }}
/>
<${TextField} id="year-max"
              value=${detailedQueryState.rangeFilters.year_built.max}
              disabled=${submitted}
              onBlur=${(e) =>
                handleRangeChange(e, "year_built", stateInfo, "max")}
              label="Maximum"
              type="number"
              helperText=" "
              inputProps=${{
                inputMode: "numeric",
                min: 1697,
                max: 2021,
                pattern: "[1,2][0-9]{3}",
              }}
/>
</${Box}>
`;
}

export function numberRangeFilter(
  stateInfo,
  field,
) {
  const { detailedQueryState, submitted, validRange } = stateInfo
  return html`
<${Box} sx=${{
    display: "flex",
    alignItems: "center",
    "& > :not(style)": { m: 1 },
  }}>
<${TextField} id=${field + "-min"}
              value=${detailedQueryState.rangeFilters[field].min}
              disabled=${submitted}
              onBlur=${(e) => handleRangeChange(e, field, stateInfo, "min")}
              label="Minimum"
              type="number"
              helperText=${helperText[field]}
              inputProps=${{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
/>
<${TextField} id=${field + "-max"}
              value=${detailedQueryState.rangeFilters[field].max}
              disabled=${submitted}
              onBlur=${(e) => handleRangeChange(e, field, stateInfo, "max")}
              label="Maximum"
              type="number"
              helperText=${helperText[field]}
              inputProps=${{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
/>
</${Box}>
  `;
}
