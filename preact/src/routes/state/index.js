import { h } from "preact";
import htm from "htm";
import { getStateBridges } from "../../utils/nbi-api";
import { useEffect, useState, useRef } from "preact/hooks";
import { ChoroplethMap } from "../../components/choroplethMap";
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

import { LocaleDescription } from "../../components/localeDescription";
import { QueryForm } from "../../components/queryForm";
import { singleFilters, multiFilters } from "../../components/options";

const html = htm.bind(h);

const stateFilters = (({ state, material, type, service }) => ({
  state,
  material,
  type,
  service,
}))(multiFilters);

function constructURI(query) {
  const searchParams = new URLSearchParams();
  const keys = Object.keys(query);
  keys.forEach((item) => {
    if (item === "plot_type") {
      const value = query["plot_type"];
      searchParams.set(item, singleFilters.plot_type.options[value].query);
    } else {
      if (query[item].length !== 0) {
        const filterMap = multiFilters[item].options;
        searchParams.set(item, query[item].map((d) => filterMap[d]).sort());
      }
    }
  });
  const uriString = searchParams.toString().toLowerCase();
  return uriString;
}

const dateKeys = ['min', 'max', 'mode']

function fixDateData(data) {
  if (!data.totalValues) {
    return data
  }
  data.totalValues = data.totalValues.map(d => ({...d, 'future_date_of_inspection': new Date(d.future_date_of_inspection)}))
  let keyValues = data.keyData
  data.keyData.min = new Date(keyValues.min)
  data.keyData.max = new Date(keyValues.max)
  data.keyData.mode = new Date(keyValues.mode)
  data.countyBin.forEach(d => {
    d.objKeyValues.min = new Date(d.objKeyValues.min)
    d.objKeyValues.max = new Date(d.objKeyValues.max)
    d.objKeyValues.mode = new Date(d.objKeyValues.mode)
    d.objHistogram = d.objHistogram.map(f => ({...f, "future_date_of_inspection": new Date(f.future_date_of_inspection)}))
  }
  )
  return data
}

export default function StateBridges() {
  const [stateBridges, setStateBridges] = useState({});
  const [queryState, setQueryState] = useState({
    plot_type: "percent_poor",
    material: [],
    type: [],
    service: [],
    state: ["California"],
  });
  const [queryURI, setQueryURI] = useState("rating");
  const [submitted, setSubmitted] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [plotType, setPlotType] = useState(queryState.plot_type);
  const [showPlot, setShowPlot] = useState(true);

  const handleChange = (event, type) => {
    const value = event.target.value;
    const valueArray =
      typeof value === "string" ? value.split(",").sort() : value.sort();
    if (queryState.state.length === 0) {
      setShowPlot(false);
    }
    setQueryState({ ...queryState, [type]: valueArray });
    setWaiting(true);
  };

  const handleSingleChange = (event, type) => {
    const value = event.target.value;
    setQueryState({ ...queryState, [type]: value });
    const newURI = constructURI({ ...queryState, [type]: value });
    if (newURI !== queryURI) {
      setSubmitted(true);
      setWaiting(true);
    }
    if (type === "plot_type" && plotType !== value) {
      setPlotType(value);
    }
  };

  const handleFormClose = (event) => {
    const newURI = constructURI(queryState);
    if (newURI !== queryURI && queryState.state.length !== 0) {
      setSubmitted(true);
    }
  };

  const handleClick = (event) => {
    const clearedQueryState = {...queryState, 'material': [], 'type': [], 'service': []}
    setQueryState(clearedQueryState)
    const newURI = constructURI(clearedQueryState);
    if (newURI !== queryURI && queryState.state.length !== 0) {
      setSubmitted(true);
    }
  }

  // run every time submitted is updated
  useEffect(async () => {
    const newURI = constructURI(queryState);
    let bridgeData = await getStateBridges(newURI);
    setQueryURI(newURI);
    if (queryState.plot_type === "future_date_of_inspection") {
      bridgeData = fixDateData(bridgeData)
    }
    setStateBridges(bridgeData);
    setSubmitted(false);
    setWaiting(false);
    setShowPlot(true);
  }, [submitted]);

  let localityString;
  if (queryState.state.length > 1) {
    localityString = [
      queryState.state.slice(0, -1).join(", "),
      queryState.state.slice(-1)[0],
    ].join(queryState.state.length < 2 ? "" : "  and ");
  } else {
    localityString = queryState.state;
  }

  const renderPlotType = plotType;
  const renderSubmitted = submitted;
  const renderWaiting = waiting;
  const colWidth = { single: 12, multi: 12 };

  return html`
<${Box} sx=${{ padding: [0, 3], pt: [2,3] }}>
  <${Container} maxWidth="lg">
    <${Grid} container spacing=${[2,3]}>
      <${Grid} item xs=${12} md=${4}>
        <${Paper} sx=${{ padding: 3, minHeight: {xs: 0, md: 880}}}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} variant="h4" component="h1">Bridges By State Selection</${Typography}>
            </${Grid}>
            <${QueryForm} queryState=${queryState}
                          handleChange=${handleChange}
                          handleClose=${handleFormClose}
                          handleSingleChange=${handleSingleChange}
                          submitted=${renderSubmitted}
                          plotChoices=${singleFilters.plot_type}
                          filters=${stateFilters}
                          handleClick=${handleClick}
                          colWidth=${colWidth}
                          />
            <${Grid} item xs=${12}>
              ${renderSubmitted ? html`
              <${Paper} sx=${{padding: 2}} variant="outlined">
                <${Typography} style=${"text-align: center"}
                               variant="h6"
                               color=${grey[500]}>
                  <i>Loading query...</i>
                </${Typography}>
                <${LinearProgress} />
                </${Paper}>
                  ` : null}
            </${Grid}>
          </${Grid}>
        </${Paper}>
      </${Grid}>
      <${Grid} item xs=${12} md=${8}>
        <${Paper} sx=${{ padding: 3, minHeight: {xs: 0, md: 880} }}>
          <${Grid} container spacing=${3}>
            ${
            !isEmpty(stateBridges) &&
            !stateBridges.hasOwnProperty("message") &&
            showPlot
            ? html`
            <${ChoroplethMap}
              bridgeCountyData=${stateBridges}
              displayStates=${queryState.state}
              plotType=${plotType}
              submitted=${renderSubmitted}
              />`
            : null
            }
            ${(!renderSubmitted && stateBridges.hasOwnProperty("message")) ?
            html`
            <${Grid} item xs=${12}>
              <${Typography} style=${"text-align: center"}
                             variant="h6"
                             color=${grey[500]}>
                <i>${stateBridges.message}</i>
              </${Typography}>
            </${Grid}>` : null}
          </${Grid}>
        </${Paper}>
      </${Grid}>
      ${
      !isEmpty(stateBridges) &&
      !stateBridges.hasOwnProperty("message") &&
      showPlot &&
      queryState.state.length !== 0
      ? html`
      <${LocaleDescription}
        summaryType=${renderPlotType}
        keyValues=${{
        field: renderPlotType,
        count: stateBridges.keyData.count,
        locality: localityString,
        filters: queryState,
        }}
        waiting=${renderWaiting}
        submitted=${renderSubmitted}
        />`
      : null
      }
    </${Grid}>
  </${Container}>
</${Box}>`;
}
