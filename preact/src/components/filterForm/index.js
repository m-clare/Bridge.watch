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


const html = htm.bind(h);

const plotOptions = ["rating", "year built"];

const structureTypeOptions = {
  "Slab": "1",
  "Stringer/Multi-beam or Girder": "2",
  "Girder and Floorbeam System": "3",
  "Tee Beam": "4",
  "Box Beam or Girders - Multiple": "5",
  "Box Beam or Girders - Single or Spread": "6",
  "Frame": "7",
  "Orthotropic": "8",
  "Truss - Deck": "9",
  "Truss - Thru": "10",
  "Arch - Deck": "11",
  "Arch - Thru": "12",
  "Suspension": "13",
  "Stayed Girder": "14",
  "Movable - Lift": "15",
  "Movable - Bascule": "16",
  "Movable - Swing": "17",
  "Segmental Box Girder": "21",
  "Channel Beam": "22"
};

const materialOptions = {
  "Reinforced Concrete": "1,2",
  "Steel": "3,4",
  "Prestressed or Post-tensioned Concrete": "5,6",
  "Wood or Timber": "7",
  "Masonry": "8",
  "Aluminum, Wrought Iron, or Cast Iron": "9",
  "Other": "0",
}

const serviceTypeOptions = {
  "Highway": "1",
  "Railroad": "2",
  "Pedestrian-bicycle": "3",
  "Highway-railroad": "4",
  "Highway-pedestrian": "5",
  "Overpass structure at an interchange": "6",
  "Third level (interchange)": "7",
  "Fourth level (interchange)": "8",
  "Building or plaza": "9",
  "Other": "0"
}

const filters = [
  {'name': 'material', 'label': 'Bridge Material', 'options': materialOptions},
  {'name': 'type', 'label': 'Bridge Type', 'options': structureTypeOptions},
  {'name': 'service', 'label': 'Service Type', 'options': serviceTypeOptions}
]

function singleFilter(filter, queryState, formHandlers) {
  
}

function multiFilter(filter, queryState, formHandlers) {

  const handleChange = formHandlers.handleChange
  const renderSubmitted = formHandlers.submitted
  const handleClose = formHandlers.handleClose

  const colWidth = Math.max(4, Math.round(12 / filters.length))

  return html
`<${Grid} item xs=${12} md=${colWidth}>
  <${FormControl} sx=${{ m: 1, minWidth: 240}} fullWidth style=${"margin: 0px"}>
    <${InputLabel}>${filter.label}</${InputLabel}>
    <${Select}
      value=${queryState[filter.name]}
      label=${filter.name}
      onChange=${(e) => handleChange(e, filter.name)}
      onClose=${handleClose}
      multiple
      disabled=${renderSubmitted}
      input=${ html`<${OutlinedInput} id="select-multiple-chip" label=${filter.label} />` }
      renderValue=${(selected) => (
      html`<${Box} sx=${{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
        ${selected.map(value => (
        html`<${Chip} key=${value} label=${value} />`
        ))}
      </${Box}>`)}
      >
      ${Object.keys(filter.options).map((name, index) => {
      return html`<${MenuItem} value=${name}>${name}</${MenuItem}>`
      })};
    </${Select}>
  </${FormControl}>
</${Grid}>`

}

/* export function FilterForm({ queryObj, handleChange, handleClose, submitted }) { */
export function FilterForm({ queryState, handleChange, handleClose, submitted }) {

  const formHandlers = {} ;
  formHandlers.handleChange = handleChange;
  formHandlers.handleClose = handleClose;
  formHandlers.submitted = submitted

  return html`
  <${Grid} container spacing=${3} sx=${{flexGrow: 1}}>
    ${filters.map(value => (multiFilter(value, queryState, formHandlers)))}
  </${Grid}>
  `
}
