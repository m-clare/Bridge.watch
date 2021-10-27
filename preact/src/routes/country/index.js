import { h } from "preact";
import htm from "htm";
import { getNationalBridges } from "../../utils/nbi-api";
import { useEffect, useState, useRef } from "preact/hooks";
import { HexbinChart } from "../../components/hexbinMap";
import { isEmpty } from "lodash-es";
import { isEqual } from "lodash-es";
import { makeStyles } from "@mui/styles";

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
import { FilterForm } from "../../components/filterForm";
import style from "./style.css";

const html = htm.bind(h);

const useStyles = makeStyles({
  typographyVariant: {
    fontVariant: "small-caps"
  }
})

const plotOptions = ["rating", "year_built", "percent_poor"];

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

const plotQuery = {
  'percent_poor': 'rating',
  'rating': 'rating',
  'year_built': 'year_built'
}

const displayOptions  = {
  'percent_poor': 'Percent in poor condition',
  'rating': 'Lowest rating',
  'year_built': 'Year built'
}

const filterMapping = {
  'material': materialOptions,
  'type': structureTypeOptions,
  'service': serviceTypeOptions
}

// only visible if Rating Selected
const startDecadeOptions = []; 

const endDecadeOptions = [];

function constructURI(query) {
  const searchParams = new URLSearchParams()
  const keys = Object.keys(query)
  keys.forEach(item => {
    if (item === 'plot_type') {
      searchParams.set(item, plotQuery[query['plot_type']])
    }
    else {
      if (query[item].length !== 0) {
        const filterMap = filterMapping[item]
        searchParams.set(item, query[item].map(d => filterMap[d]).sort())
      }
    }
  })
  const uriString = searchParams.toString().toLowerCase();
  return uriString
}

export default function Country() {
  const classes = useStyles();

  const [bridges, setBridges] = useState({});
  const [queryState, setQueryState] = useState({'plot_type': 'percent_poor',
                                                'material': [],
                                                'type': [],
                                                'service': []
                                               })
  const [queryURI, setQueryURI] = useState('plot_type=percent_poor')
  const [submitted, setSubmitted] = useState(true);
  const [hexSize, setHexSize] = useState(true)

  const handleChange = (event, type) => {
    const value = event.target.value
    const valueArray = typeof(value) === 'string' ? value.split(',').sort() : value.sort()
    setQueryState({...queryState, [type]: valueArray})
  };

  const handleSingleSelectChange = (event, type) => {
    const value = event.target.value.replace(' ', '_')
    setQueryObj({...queryState, [type]: value})
  }

  const handleFormClose = (event) => {
    const newURI = constructURI(queryState)
    if (newURI !== queryURI) { 
      setSubmitted(true);
    }
  }

  useEffect(async () => {
    const newURI = constructURI(queryState)
    const bridgeData = await getNationalBridges(newURI);
    setQueryURI(newURI);
    setBridges(bridgeData);
    setSubmitted(false);
  }, [submitted]);

  const plotType = queryState.plot_type;
  const renderSubmitted = submitted;
  const scaledHexBool = hexSize;

  return html`
    <div class=${style.country}>
      <${Box} sx=${{ flexShrink: 1 }}>
        <${Grid} container spacing=${2}>
          <${Grid} item xs=${12}>
            <${Paper} variant=${"outlined"} style=${"padding: 24px; "}>
              <${Grid} container>
                <${Grid} item xs=${12}>
                  <${Typography} className=${classes.typographyVariant}
                                 variant="h3" component="h1">National Bridge Inventory</${Typography}>
                </${Grid}>
                <${Grid} item xs=${12}>
                  <${Typography} style=${"padding-bottom: 16px"}
                                 variant="h6"
                                 component="h2"
                                 color="${grey[500]}">
                    <i>Display Options</i>
                  </${Typography}>
                </${Grid}>
                <${Grid} container spacing=${3} style=${"padding-bottom: 24px"}>
                    <${Grid} item>
                    <${FormControl} sx=${{ minWidth: 240}} style=${"margin: 0px"}>
                      <${InputLabel}>Plot Type</${InputLabel}>
                      <${Select} value=${queryState.plot_type}
                                 label="Plot Type"
                                 disabled=${renderSubmitted}
                                 onChange=${(e) => handleSingleSelectChange(e, 'plot_type')}
                                 onClose=${handleFormClose}
                        >
                        ${plotOptions.map((name, index) => {
                        return html`<${MenuItem} key=${name}
                                                 value=${name}
                                                 >
                        ${displayOptions[name]}</${MenuItem}>`
                        })};
                      </${Select}>
                    </${FormControl}>
                    </${Grid}>
                </${Grid}>
                <${FilterForm} queryState=${queryState}
                               handleChange=${handleChange}
                               handleClose=${handleFormClose}
                               submitted=${renderSubmitted}
                               />
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
          </${Grid}>`) : (null)}
          ${(!isEmpty(bridges) && !bridges.hasOwnProperty('message'))  ?
          (html`<${CountryDescription} summaryType=${plotType} keyValues=${{
                                       field: plotType,
                                       count: bridges.natData.count,
                                       filters: queryState
          }}/><${HexbinChart} bridgeData=${bridges} plotType=${plotType} hexSize=${scaledHexBool}/>`) : null}
          ${(!renderSubmitted && bridges.hasOwnProperty('message'))  ?
          (html`<${Grid} item xs=${12}>
            <${Paper} variant=${"outlined"} style=${"padding: 16px; "}>
              <${Grid} container>
                <${Grid} item xs=${12}>
                  <${Typography} style=${"text-align: center"}
                                 variant="h6"
                                 color=${grey[500]}>
                    <i>${bridges.message}</i>
                  </${Typography}>
                </${Grid}>
              </${Grid}>
            </${Paper}>
          </${Grid}>`) : null}
        </${Grid}>
      </${Box}>
    </div>`;
    }
