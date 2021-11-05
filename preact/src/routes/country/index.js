import { h } from "preact";
import htm from "htm";
import { getNationalBridges } from "../../utils/nbi-api";
import { useEffect, useState, useRef } from "preact/hooks";
import { HexbinChart } from "../../components/hexbinMap";
import { isEmpty } from "lodash-es";
import { isEqual } from "lodash-es";
import { makeStyles } from "@mui/styles";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
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
import { QueryForm } from "../../components/queryForm";
import { singleFilters, multiFilters } from "../../components/Options";

const html = htm.bind(h);

const countryFilters = (({ material, type, service  }) => ({ material, type, service  }))(multiFilters);

function constructURI(query) {
  const searchParams = new URLSearchParams()
  const keys = Object.keys(query)
  keys.forEach(item => {
    if (item === 'plot_type') {
      const value = query['plot_type']
      searchParams.set(item, singleFilters.plot_type.options[value].query)
    }
    else {
      if (query[item].length !== 0) {
        const filterMap = countryFilters[item].options
        searchParams.set(item, query[item].map(d => filterMap[d]).sort())
      }
    }
  })
  const uriString = searchParams.toString().toLowerCase();
  return uriString
}

function updateQuery(queryState, type, updatedParam) {
  return {...queryState, [type]: updatedParam}
}
export default function CountryBridges() {
  const [bridges, setBridges] = useState({});
  const [queryState, setQueryState] = useState({'plot_type': 'percent_poor',
                                                'material': [],
                                                'type': [],
                                                'service': []
                                               })
  const [queryURI, setQueryURI] = useState('plot_type=percent_poor')
  const [submitted, setSubmitted] = useState(true);
  const [hexSize, setHexSize] = useState(true)
  const [plotType, setPlotType] = useState(queryState.plot_type)

  const handleChange = (event, type) => {
    const value = event.target.value
    const valueArray = typeof(value) === 'string' ? value.split(',').sort() : value.sort()
    setQueryState({...queryState, [type]: valueArray})
  };

  const handleSingleChange = (event, type) => {
    const value = event.target.value.replace(' ', '_')
    setQueryState({...queryState, [type]: value})
    const newURI = constructURI({...queryState, [type]: value})
    if (newURI !== queryURI ) {
      setSubmitted(true)
    }
    if (plotType !== value ) {
      setPlotType(value)
    }
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

  const renderPlotType = plotType;
  const renderSubmitted = submitted;
  const scaledHexBool = hexSize;

  const colWidth = {'single': 4, 'multi': 4}

  return html`
<${Box} sx=${{ padding: "24px"}}>
  <${Container} maxWidth="lg">
    <${Grid} container spacing=${3}>
      <${Grid} item xs=${12}>
        <${Paper} style=${"padding: 24px; "}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} variant="h3" component="h1">National Bridge Inventory</${Typography}>
            </${Grid}>
            <${QueryForm} queryState=${queryState}
                          handleChange=${handleChange}
                          handleClose=${handleFormClose}
                          handleSingleChange=${handleSingleChange}
                          submitted=${renderSubmitted}
                          plotChoices=${singleFilters.plot_type}
                          filters=${countryFilters}
                          colWidth=${colWidth}
                          />
          </${Grid}>
        </${Paper}>
      </${Grid}>
      ${renderSubmitted ? (
      html`<${Grid} item xs=${12}>
        <${Paper} style=${"padding: 16px; "}>
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
      (html`<${CountryDescription} summaryType=${renderPlotType} keyValues=${{
                                   field: renderPlotType,
                                   count: bridges.natData.count,
                                   filters: queryState
                                   }}/><${HexbinChart} bridgeData=${bridges} plotType=${renderPlotType} hexSize=${scaledHexBool}/>`) : null}
      ${(!renderSubmitted && bridges.hasOwnProperty('message'))  ?
      (html`<${Grid} item xs=${12}>
        <${Paper} style=${"padding: 16px; "}>
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
  </${Container}>
</${Box}>`;
}
