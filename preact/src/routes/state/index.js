import { h } from "preact";
import htm from "htm";
import { getStateBridges } from "../../utils/nbi-api";
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
import { filters, plotOptions } from "../../components/Options";

const html = htm.bind(h);

const stateFilters = (({ state, material, type, service  }) => ({ state, material, type, service  }))(filters);


function constructURI(query) {
  const searchParams = new URLSearchParams()
  const keys = Object.keys(query)
  keys.forEach(item => {
    if (item === 'plot_type') {
      const value = query['plot_type']
      searchParams.set(item, plotOptions[value].query)
    }
    else {
      if (query[item].length !== 0) {
        const filterMap = filters[item].options
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

export default function StateBridges() {
  const [stateBridges, setStateBridges] = useState({});

  const [queryState, setQueryState] = useState({'plot_type': 'percent_poor',
                                                'material': [],
                                                'type': [],
                                                'service': [],
                                                'state': ['California']
                                               })
  const [queryURI, setQueryURI] = useState('plot_type=percent_poor')
  const [submitted, setSubmitted] = useState(true);
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
    const bridgeData = await getStateBridges(newURI);
    setQueryURI(newURI);
    setStateBridges(bridgeData);
    setSubmitted(false);
  }, [submitted]);

  const renderPlotType = plotType;
  const renderSubmitted = submitted;
  const colWidth = {'single': 6, 'multi': 4}
  console.log(colWidth)

  return html`
<${Box} sx=${{ padding: "24px"}}>
  <${Container} maxWidth="lg">
    <${Grid} container spacing=${3}>
      <${Grid} item xs=${12} md=${6}>
        <${Paper} style=${"padding: 24px; "}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} variant="h3" component="h1">State Bridge Inventory</${Typography}>
            </${Grid}>
            <${QueryForm} queryState=${queryState}
                          handleChange=${handleChange}
                          handleClose=${handleFormClose}
                          handleSingleChange=${handleSingleChange}
                          submitted=${renderSubmitted}
                          plotOptions=${plotOptions}
                          filters=${stateFilters}
                          colWidth=${colWidth}
                          />
          </${Grid}>
        </${Paper}>
      </${Grid}>
<${Grid} item xs=${12} md=${6}>
        <${Paper} style=${"padding: 24px; "}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} variant="h3" component="h1">${queryState.state}</${Typography}>
            </${Grid}>
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
      ${(!renderSubmitted && stateBridges.hasOwnProperty('message'))  ?
      (html`<${Grid} item xs=${12}>
  <${Paper} style=${"padding: 16px; "}>
  <${Grid} container>
  <${Grid} item xs=${12}>
  <${Typography} style=${"text-align: center"}
                             variant="h6"
                             color=${grey[500]}>
                <i>${stateBridges.message}</i>
              </${Typography}>
            </${Grid}>
          </${Grid}>
        </${Paper}>
      </${Grid}>`) : null}
    </${Grid}>
  </${Container}>
</${Box}>`;
}
