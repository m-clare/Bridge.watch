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
  const [isLoading, setIsLoading] = useState(true);
  const [bridges, setBridges] = useState({});
  const [material, setMaterial] = useState([]);
  const [plotType, setPlotType] = useState("rating");

  // set default plot type for page to load
  const [uriString, setUriString] = useState("plot_type=rating");
  const [submitted, setSubmitted] = useState(false);

  const handleMaterialChange = (event) => {
    const {
      target: { value },
    } = event;
    setMaterial(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleMaterialClose = (event) => {
    setSubmitted(true);
  }

  const handlePlotChange = (event) => {
    setPlotType(event.target.value);
    setSubmitted(true)
  };

  useEffect(() => {
    const searchParams = new URLSearchParams()
    const materialValues = material.map(mat => materialToKey[mat])
    searchParams.set('plot_type', plotType)
    if (material.length !== 0) {
      searchParams.set('material', materialValues)
    }
    setUriString(searchParams.toString().toLowerCase())
}, [material, plotType])


  useEffect(async () => {
    const bridgeData = await getNationalBridges(uriString);
    setBridges(bridgeData);
    setIsLoading(false);
    setSubmitted(false);
  }, [submitted]);

  return html`
    <div class=${style.country}>
      <${Box} sx=${{ flexShrink: 1 }}>
      <${Grid} container spacing=${2}>
        <${Grid} item xs=${12}>
          <${Paper} variant=${"outlined"} style=${"padding: 15px; "}>
            <${Grid} container>
              <${Grid} item xs=${12}>
                <${Typography} variant="h3" component="h1">National Bridge Inventory 2020</${Typography}>
              </${Grid}>
              <${Grid} item xs=${12}>
                <${Typography} variant="h6" component="h2" color="${grey[500]}"><i>Display Options</i></${Typography}>
              </${Grid}>
              <${Grid} container spacing=${3}>
              <${Grid} item>
                <${FormControl} sx=${{ minWidth: 240}} style=${"margin: 0px"}>
                  <${InputLabel}>Plot Type</${InputLabel}>
                  <${Select}
                    value=${plotType}
                    label="Plot Type"
                    disabled=${submitted}
                    onChange=${handlePlotChange}
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
                    value=${material}
                    label="Material"
                    onChange=${handleMaterialChange}
                    onClose=${handleMaterialClose}
                    multiple
                    disabled=${submitted}
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
        </${Grid} >
        ${!isEmpty(bridges)  ?
        (html`<${CountryDescription} summaryType=${bridges.field} keyValues=${{
                                     field: bridges.field,
                                     count: bridges.natData.count,
                                     }}/><${HexbinChart} bridgeData=${bridges} />`) :
        (html`<${Grid} item xs=${12}>
          <${Paper} variant=${"outlined"} style=${"padding: 15px; "}>
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
        </${Grid}>`)}
      </${Grid}>
      </${Box}>
    </div> `;
}

