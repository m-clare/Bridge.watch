import { h } from "preact";
import htm from "htm";
import { getNationalBridges } from "../../utils/nbi-api";
import { useEffect, useState, useRef } from "preact/hooks";
import { HexbinChart } from "../../components/hexbinMap";
import { isEmpty } from "lodash-es";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";

// form only imports...
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";

import { CountryDescription } from "../../components/countryDescription";

import style from "./style.css";

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
  {'filter': 'material', 'label': 'Bridge Material', 'options': materialOptions},
  {'filter': 'type', 'label': 'Bridge Type', 'options': structureTypeOptions},
  {'filter': 'service', 'label': 'Service Type', 'options': serviceTypeOptions}
]

// only visible if Rating Selected
const startDecadeOptions = [];

const endDecadeOptions = [];

export default function Country() {
  const [bridges, setBridges] = useState({});
  const [queryObj, setQueryObj] = useState({'plot_type': 'rating',
                                            'material': [],
                                            'type': [],
                                            'service': []
                                            })
  const [submitted, setSubmitted] = useState(true);

  // TODO: Find way to consolidate these event handlers
  const handleChange = (event, type) => {
    const value = event.target.value
    const valueArray = typeof(value) === 'string' ? value.split(',') : value
    setQueryObj({...queryObj, [type]: valueArray})
  };

  const handleFormClose = (event) => {
    setSubmitted(true);
  }

  useEffect(async () => {
    const searchParams = new URLSearchParams()
    searchParams.set('plot_type', queryObj['plot_type'])
    if (queryObj['material'].length !== 0) {
      searchParams.set('material', queryObj['material'].map(d => materialOptions[d]))
    }
    if (queryObj['type'].length !== 0) {
      searchParams.set('type', queryObj['type'].map(d => structureTypeOptions[d]))
    }
    if (queryObj['service'].length !== 0) {
      searchParams.set('service', queryObj['service'].map(d => serviceTypeOptions[d]))
    }
    const uriString = searchParams.toString().toLowerCase()
    console.log(uriString);
    const bridgeData = await getNationalBridges(uriString);
    setBridges(bridgeData);
    setSubmitted(false);
  }, [submitted]);

  function filter(filterObj) {
    return html
`<${Grid} item>
  <${FormControl} sx=${{ m: 1, minWidth: 240}} style=${"margin: 0px"}>
    <${InputLabel}>${filterObj.label}</${InputLabel}>
    <${Select}
      value=${queryObj[filterObj.filter]}
      label=${filterObj.filter}
      onChange=${(e) => handleChange(e, filterObj.filter)}
      onClose=${handleFormClose}
      multiple
      disabled=${renderSubmitted}
      input=${ html`<${OutlinedInput} id="select-multiple-chip" label=${filterObj.label} />` }
      renderValue=${(selected) => (
      html`<${Box} sx=${{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
        ${selected.map(value => (
        html`<${Chip} key=${value} label=${value} />`
        ))}
      </${Box}>`)}
      >
      ${Object.keys(filterObj.options).map((name, index) => {
      return html`<${MenuItem} value=${name}>${name}</${MenuItem}>`
      })};
    </${Select}>
  </${FormControl}>
</${Grid}>
`}

  const renderSubmitted = submitted;

  return html`
    <div class=${style.country}>
      <${Box} sx=${{ flexShrink: 1 }}>
        <${Grid} container spacing=${2}>
          <${Grid} item xs=${12}>
            <${Paper} variant=${"outlined"} style=${"padding: 15px; "}>
              <${Grid} container>
                <${Grid} item xs=${12}>
                  <${Typography} variant="h3" component="h1">National Bridge Inventory</${Typography}>
                </${Grid}>
                <${Grid} item xs=${12}>
                  <${Typography} style=${"padding-bottom: 8px"}
                                 variant="h6"
                                 component="h2"
                                 color="${grey[500]}">
                    <i>Display Options</i>
                  </${Typography}>
                </${Grid}>
                <${Grid} container spacing=${3}>
                  <${Grid} item>
                    <${FormControl} sx=${{ minWidth: 240}} style=${"margin: 0px"}>
                      <${InputLabel}>Plot Type</${InputLabel}>
                      <${Select} value=${queryObj.plot_type}
                                 label="Plot Type"
                                 disabled=${renderSubmitted}
                                 onChange=${(e) => handleChange(e, 'plot_type')}
                                 onClose=${handleFormClose}
                        >
                        ${plotOptions.map((name, index) => {
                        return html`<${MenuItem} key=${name}
                                                 value=${name}
                                                 >
                          ${name.charAt(0).toUpperCase() + name.slice(1)}</${MenuItem}>`
                        })};
                      </${Select}>
                    </${FormControl}>
                  </${Grid}>
                  ${filters.map(value => (filter(value)))}
                </${Grid}>
              </${Grid}>
            </${Paper}>
          </${Grid}>
          ${renderSubmitted ? (
          html`<${Grid} item xs=${12}>
            <${Paper} variant=${"outlined"} style=${"padding: 16px; "}>
              <${Grid} container>
                <${Grid} item xs=${12}>
                  <${Typography} style=${"text-align: center"}
                                 variant="h6"
                                 color=${grey[500]}>
                    <i>Loading query...</i>
                  </${Typography}>
                  <${LinearProgress} />
                </${Grid}>
              </${Grid}>
            </${Paper}>
          </${Grid}>`) : (html`<div></div>`)}
          ${(!isEmpty(bridges) || (!bridges) && !bridges.message)  ?
          (html`<${CountryDescription} summaryType=${bridges.field} keyValues=${{
                                       field: bridges.field,
                                       count: bridges.natData.count,
                                       filters: queryObj
                                       }}/><${HexbinChart} bridgeData=${bridges} />`) : null}
          ${(!renderSubmitted && bridges.message)  ?
          (html`<${Grid} item xs=${12}>
            <${Paper} variant=${"outlined"} style=${"padding: 16px; "}>
              <${Grid} container>
                <${Grid} item xs=${12}>
                  <${Typography} style=${"text-align: center"}
                                 variant="h6"
                                 color=${grey[500]}>
                    <i>No bridges found for custom query!</i>
                  </${Typography}>
                </${Grid}>
              </${Grid}>
            </${Paper}>
          </${Grid}>`) : null}
        </${Grid}>
      </${Box}>
    </div>`;
    }
    
