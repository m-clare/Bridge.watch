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
import useWindowDimensions from "../../components/windowDimensions";


import { LocaleDescription } from "../../components/localeDescription";
import { QueryForm } from "../../components/queryForm";
import { singleFilters, multiFilters } from "../../components/options";

const html = htm.bind(h);

const countryFilters = (({ material, type, service }) => ({
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
        const filterMap = countryFilters[item].options;
        searchParams.set(item, query[item].map((d) => filterMap[d]).sort());
      }
    }
  });
  const uriString = searchParams.toString().toLowerCase();
  return uriString;
}

function fixDateData(data) {
  if (!data.totalValues) {
    return data;
  }
  data.totalValues = data.totalValues.map((d) => ({
    ...d,
    future_date_of_inspection: new Date(d.future_date_of_inspection),
  }));
  let keyValues = data.keyData;
  data.keyData.min = new Date(keyValues.min);
  data.keyData.max = new Date(keyValues.max);
  data.keyData.mode = new Date(keyValues.mode);
  data.hexBin.forEach((d) => {
    d.objKeyValues.min = new Date(d.objKeyValues.min);
    d.objKeyValues.max = new Date(d.objKeyValues.max);
    d.objKeyValues.mode = new Date(d.objKeyValues.mode);
    d.objHistogram = d.objHistogram.map((f) => ({
      ...f,
      future_date_of_inspection: new Date(f.future_date_of_inspection),
    }));
  });
  return data;
}

function updateQuery(queryState, type, updatedParam) {
  return { ...queryState, [type]: updatedParam };
}
export default function CountryBridges() {
  const [bridges, setBridges] = useState({});
  const [queryState, setQueryState] = useState({
    plot_type: "percent_poor",
    material: [],
    type: [],
    service: [],
  });
  const [queryURI, setQueryURI] = useState("plot_type=percent_poor");
  const [submitted, setSubmitted] = useState(true);
  const [hexSize, setHexSize] = useState(true);
  const [plotType, setPlotType] = useState(queryState.plot_type);
  const [waiting, setWaiting] = useState(false);

  const { deviceHeight, deviceWidth } = useWindowDimensions();

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
    if (plotType !== value) {
      setPlotType(value);
    }
  };

  const handleFormClose = (event) => {
    const newURI = constructURI(queryState);
    if (newURI !== queryURI) {
      setSubmitted(true);
    }
  };

  const handleClick = (event) => {
    const clearedQueryState = {
      ...queryState,
      material: [],
      type: [],
      service: [],
    };
    setQueryState(clearedQueryState);
    const newURI = constructURI(clearedQueryState);
    if (newURI !== queryURI) {
      setSubmitted(true);
    }
  };

  useEffect(async () => {
    const newURI = constructURI(queryState);
    let bridgeData = await getNationalBridges(newURI);
    setQueryURI(newURI);
    if (queryState.plot_type === "future_date_of_inspection") {
      bridgeData = fixDateData(bridgeData);
    }
    setBridges(bridgeData);
    setSubmitted(false);
    setWaiting(false);
  }, [submitted]);

  const renderPlotType = plotType;
  const renderSubmitted = submitted;
  const scaledHexBool = hexSize;
  const renderWaiting = waiting;
  const locality = "the U.S.";

  const colWidth = { single: 4, multi: 4 };

  return html`
<${Box} sx=${{ padding: [0, 3], pt: [2,3] }}>
  <${Container} maxWidth="lg">
    <${Grid} container spacing=${[2,3]}>
      <${Grid} item xs=${12}>
        <${Paper} sx=${{ padding: 3 }}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} variant="h3" component="h1">U.S. Bridges</${Typography}>
            </${Grid}>
            <${QueryForm} queryState=${queryState}
                          handleChange=${handleChange}
                          handleClose=${handleFormClose}
                          handleSingleChange=${handleSingleChange}
                          submitted=${renderSubmitted}
                          plotChoices=${singleFilters.plot_type}
                          filters=${countryFilters}
                          handleClick=${handleClick}
                          colWidth=${colWidth}
                          />
          </${Grid}>
        </${Paper}>
      </${Grid}>
      ${
        renderSubmitted
          ? html`<${Grid} item xs=${12}>
        <${Paper} sx=${{ padding: 2 }}>
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
      </${Grid}>`
          : null
      }
      ${
        !isEmpty(bridges) && !bridges.hasOwnProperty("message")
          ? html`<${LocaleDescription}
                summaryType=${renderPlotType}
                keyValues=${{
                  field: renderPlotType,
                  count: bridges.keyData.count,
                  locality: locality,
                  filters: queryState,
                }}
                waiting=${renderWaiting}
                submitted=${renderSubmitted}
              />
             <${Grid} item container spacing=${3}>
              <${HexbinChart}
                bridgeData=${bridges}
                plotType=${renderPlotType}
                hexSize=${scaledHexBool}
                submitted=${submitted}
              />
             </${Grid}>
            `
          : null
      }
      ${
        !renderSubmitted && bridges.hasOwnProperty("message")
          ? html`<${Grid} item xs=${12}>
        <${Paper} sx=${{ padding: 2 }}>
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
      </${Grid}>`
          : null
      }
    </${Grid}>
  </${Container}>
</${Box}>`;
}
