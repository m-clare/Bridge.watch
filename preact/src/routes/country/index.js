import { h } from "preact";
import htm from "htm";
import { getNationalBridges } from "../../utils/bdi-api";
import { useEffect, useState, useRef } from "preact/hooks";
import { HexbinChart } from "../../components/hexbinMap";
import { isEmpty } from "lodash";

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

const materialFilterOptions = [
  "Reinforced Concrete",
  "Steel",
  "Prestressed or Post-tensioned Concrete",
  "Wood or Timber",
  "Masonry",
  "Aluminum, Wrought Iron, or Cast Iron",
  "Other",
];

const structureTypeOptions = [
  "Slab",
  "Stringer/Multi-beam or Girder",
  "Girder and Floorbeam System",
  "Tee Beam",
  "Box Beam or Girders - Multiple",
  "Box Beam or Girders - Single",
];

const materialToKey = {
  "Reinforced Concrete": "1,2",
  "Steel": "3,4",
  "Prestressed or Post-tensioned Concrete": "5,6",
  "Wood or Timber": "7",
  "Masonry": "8",
  "Aluminum, Wrought Iron, or Cast Iron": "9",
  "Other": "0",
}
// only visible if Rating Selected
const startDecadeOptions = [];

const endDecadeOptions = [];

export default function Country() {
  const [bridges, setBridges] = useState({});
  const [queryObj, setQueryObj] = useState({'plot_type': 'rating',
                                            'material': [],
                                            })
  const [submitted, setSubmitted] = useState(true);

  const handleMaterialChange = (event) => {
    const value = event.target.value
    const getMaterial = () => (
      typeof(value) === 'string' ? value.split(',') : value)
    const materials = getMaterial()
    const {oldMaterials, ...props} = {...queryObj}
    setQueryObj({...props, 'material': materials})
  };

  const handleFormClose = (event) => {
    setSubmitted(true);
  }

  const handlePlotChange = (event) => {
    const {oldPlot, ...props} = {...queryObj}
    setQueryObj({...props, 'plot_type': event.target.value})
  };

  useEffect(async () => {
    const searchParams = new URLSearchParams()
    searchParams.set('plot_type', queryObj['plot_type'])
    if (queryObj['material'].length !== 0) {
      searchParams.set('material', queryObj['material'].map(d => materialToKey[d]))
    }
    const uriString = searchParams.toString().toLowerCase()
    const bridgeData = await getNationalBridges(uriString);
    setBridges(bridgeData);
    setSubmitted(false);
  }, [submitted]);

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
                <${Typography} style=${"padding-bottom: 8px"} variant="h6" component="h2" color="${grey[500]}"><i>Display Options</i></${Typography}>
              </${Grid}>
              <${Grid} container spacing=${3}>
                <${Grid} item>
                  <${FormControl} sx=${{ minWidth: 240}} style=${"margin: 0px"}>
                    <${InputLabel}>Plot Type</${InputLabel}>
                    <${Select}
                      value=${queryObj.plot_type}
                      label="Plot Type"
                      disabled=${renderSubmitted}
                      onChange=${handlePlotChange}
                      onClose=${handleFormClose}
                      >
                      ${plotOptions.map((name, index) => {
                      return html`<${MenuItem} key=${name}
                                               value=${name}
                                               >
                        ${name}</${MenuItem}>`
                      })};
                  </${Select}>
                </${FormControl}>
              </${Grid}>
              <${Grid} item>
                <${FormControl} sx=${{ m: 1, width: 300}} style=${"margin: 0px"}>
                  <${InputLabel}>Material</${InputLabel}>
                  <${Select}
                    value=${queryObj.material}
                    label="Material"
                    onChange=${handleMaterialChange}
                    onClose=${handleFormClose}
                    multiple
                    disabled=${renderSubmitted}
                    input=${ html`<${OutlinedInput} id="select-multiple-chip" label="material" />` }
                    renderValue=${(selected) => (
                    html`<${Box} sx=${{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                      ${selected.map(value => (
                      html`<${Chip} key=${value} label=${value} />`
                      ))}
                  </${Box}>`)}
                  >
                    ${materialFilterOptions.map((name, index) => {
                    return html`<${MenuItem} value=${name}>${name}</${MenuItem}>`
                    })};
                  </${Select}>
                </${FormControl}>
              </${Grid}>
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
      ${!isEmpty(bridges)  ?
        (html`<${CountryDescription} summaryType=${bridges.field} keyValues=${{
                                     field: bridges.field,
                                     count: bridges.natData.count,
        }}/><${HexbinChart} bridgeData=${bridges} />`) : (html`<div></div>`)}
      </${Grid}>
      </${Box}>
    </div> `;
}

