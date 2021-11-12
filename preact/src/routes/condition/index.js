import { h } from "preact";
import htm from "htm";
import { getConditionBridges } from "../../utils/nbi-api";
import { useEffect, useState, useRef } from "preact/hooks";
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

import { SunburstChart } from "../../components/sunburstChart";
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
    if (item === "field") {
      const value = query["field"];
      searchParams.set(item, singleFilters.field.options[value].query)
    }
    else if (query[item].length !== 0) {
      const filterMap = multiFilters[item].options;
      searchParams.set(item, query[item].map((d) => filterMap[d]).sort());
    }
  });
  const uriString = searchParams.toString().toLowerCase();
  return uriString;
}

export default function ConditionBridges() {
  const [conditionBridges, setConditionBridges] = useState({});
  const [queryState, setQueryState] = useState({
    field: 'material',
    material: [],
    type: [],
    service: [],
    state: ["California"],
  });
  const [field, setField] = useState(queryState.field)
  const [queryURI, setQueryURI] = useState("");
  const [submitted, setSubmitted] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [showPlot, setShowPlot] = useState(true);

  const handleChange = (event, type) => {
    const value = event.target.value;
    const valueArray =
      typeof value === "string" ? value.split(",").sort() : value.sort();
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
    if (type === "field" && value !== field) {
      setField(value);
    }
  };

  const handleFormClose = (event) => {
    const newURI = constructURI(queryState);
    if (newURI !== queryURI) {
      setSubmitted(true);
    }
  };

  const handleClick = (event) => {
    const clearedQueryState = {...queryState, 'material': [], 'type': [], 'service': []}
    setQueryState(clearedQueryState)
    const newURI = constructURI(clearedQueryState);
    if (newURI !== queryURI) {
      setSubmitted(true);
    }
  }

  // run every time submitted is updated
  useEffect(async () => {
    const newURI = constructURI(queryState);
    const bridgeData = await getConditionBridges(newURI);
    setQueryURI(newURI);
    setConditionBridges(bridgeData);
    setSubmitted(false);
    setWaiting(false);
    setShowPlot(true);
  }, [submitted]);

  const renderField = field;
  const renderSubmitted = submitted;
  const renderWaiting = waiting;
  const colWidth = { single: 12, multi: 12 };

  return html`
<${Box} sx=${{ padding: 3 }}>
  <${Container} maxWidth="lg">
    <${Grid} container spacing=${3}>
      <${Grid} item xs=${12} md=${4}>
        <${Paper} sx=${{ padding: 3, minHeight: {xs: 0, md: 850}}}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} variant="h4" component="h1">Bridge Conditions</${Typography}>
            </${Grid}>
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
        <${Paper} sx=${{ padding: 3, minHeight: {xs: 0, md: 850} }}>
          <${Grid} container spacing=${3}>
            ${
            !isEmpty(conditionBridges) &&
            !conditionBridges.hasOwnProperty("message")
            ? html`
           <${SunburstChart}
              bridgeConditionData=${conditionBridges}
              field=${renderField}
              submitted=${renderSubmitted}
              />`
            : null
            }
            ${(!renderSubmitted && conditionBridges.hasOwnProperty("message")) ?
            html`
            <${Grid} item xs=${12}>
              <${Typography} style=${"text-align: center"}
                             variant="h6"
                             color=${grey[500]}>
                <i>${conditionBridges.message}</i>
              </${Typography}>
            </${Grid}>` : null}
          </${Grid}>
        </${Paper}>
      </${Grid}>
    </${Grid}>
  </${Container}>
</${Box}>`;
}
