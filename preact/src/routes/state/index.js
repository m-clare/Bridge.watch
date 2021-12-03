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
import Divider from "@mui/material/Divider";

import { LocaleDescription } from "../../components/localeDescription";
import { QueryForm } from "../../components/queryForm";
import { DetailedForm } from "../../components/detailedForm";
import {
  singleFilters,
  multiFilters,
  filterMaps,
  detailedQueryMaps,
  validRanges,
  plotOptions,
} from "../../components/options";
import { constructURI, fixDateData } from "../../components/helperFunctions";
const html = htm.bind(h);

const stateFilters = (({ state, material, type, service, service_under }) => ({
  state,
  material,
  type,
  service,
  service_under,
}))(multiFilters);

const detailedFilters = (({ ratings, deck_type, deck_surface }) => ({
  ratings, deck_type, deck_surface
}))(multiFilters);

export default function StateBridges() {
  const [stateBridges, setStateBridges] = useState({});
  const [queryState, setQueryState] = useState({
    plot_type: "percent_poor",
    material: [],
    type: [],
    service: [],
    service_under: [],
    state: ["California"],
  });
  const [detailedQueryState, setDetailedQueryState] = useState({
    ratings: [],
    deck_type: [],
    deck_surface: [],
    rangeFilters: {
      year_built: { min: "", max: "" },
      traffic: { min: "", max: "" },
      bridge_length: { min: "", max: "" },
      span_length: { min: "", max: "" },
    },
  });
  const [queryURI, setQueryURI] = useState("rating");
  const [submitted, setSubmitted] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [plotType, setPlotType] = useState(queryState.plot_type);
  const [showPlot, setShowPlot] = useState(true);

  const queryDicts = {
    plotOptions: plotOptions,
    filterMaps: filterMaps,
    detailedQueryMaps: detailedQueryMaps,
  };

  // run every time submitted is updated
  useEffect(async () => {
    const newURI = constructURI(queryState, detailedQueryState, queryDicts);
    let bridgeData = await getStateBridges(newURI);
    setQueryURI(newURI);
    if (queryState.plot_type === "future_date_of_inspection") {
      bridgeData = fixDateData(bridgeData, "countyBin");
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
<${Box} sx=${{ padding: [0, 3], pt: [2, 3] }}>
  <${Container} maxWidth="lg">
    <${Grid} container spacing=${[2, 3]}>
      <${Grid} item xs=${12} md=${4}>
        <${Paper} sx=${{ padding: 3, minHeight: { xs: 0, md: 880 } }}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} variant="h4" component="h1">Bridges By State Selection</${Typography}>
            </${Grid}>
            <${QueryForm} stateInfo=${{
                          routeType: "state",
                          state: queryState,
                          detailedQueryState: detailedQueryState,
                          submitted: renderSubmitted,
                          plotType: plotType,
                          queryURI: queryURI,
                          setState: setQueryState,
                          setWaiting: setWaiting,
                          setSubmitted: setSubmitted,
                          setPlotType: setPlotType,
                          setShowPlot: setShowPlot,
                          queryDicts: queryDicts
                          }}
                          plotChoices=${singleFilters.plot_type}
                          filters=${stateFilters}
                          colWidth=${colWidth}
                          />
                          <${Grid} item xs=${12}>
                            <${Divider} variant="middle">Detailed Filters</${Divider}>
                            <${Typography} variant="h6">Note: </${Typography}>
                            <${Typography} paragraph>You <b>must</b> click "Submit Detailed Query" to apply the following filters.</${Typography}>
                          </${Grid}>
                          <${Grid} item xs=${12}>
                            <${DetailedForm} stateInfo=${{
                                             state: queryState,
                                             detailedQueryState: detailedQueryState,
                                             submitted: renderSubmitted,
                                             queryURI: queryURI,
                                             setSubmitted: setSubmitted,
                                             setWaiting: setWaiting,
                                             setDetailedQueryState: setDetailedQueryState,
                                             validRange: validRanges,
                                             queryDicts: queryDicts
                                             }}
                                             colWidth=12
                                             filters=${detailedFilters}
                                             />
                          </${Grid}>
                          <${Grid} item xs=${12}>
                            ${
                            renderSubmitted
                            ? html`
                            <${Paper} sx=${{ padding: 2 }} variant="outlined">
                              <${Typography} style=${"text-align: center"}
                                             variant="h6"
                                             color=${grey[500]}>
                                <i>Loading query...</i>
                              </${Typography}>
                              <${LinearProgress} />
                            </${Paper}>
                            `
                            : null
                            }
                          </${Grid}>
</${Grid}>
</${Paper}>
</${Grid}>
<${Grid} item xs=${12} md=${8}>
  <${Paper} sx=${{ padding: 3, minHeight: { xs: 0, md: 880 } }}>
    <${Grid} container spacing=${3}>
      ${
      renderWaiting && !renderSubmitted
      ? html`
      <${Grid} item xs=${12}>
        <${Typography} style=${"text-align: center"}
                       variant="h6"
                       color=${grey[500]}>
          <i>Submit query to update plots.</i>
        </${Typography}>
      </${Grid}>
      `
      : null
      }
      ${
      !isEmpty(stateBridges) &&
      !stateBridges.hasOwnProperty("message") &&
      showPlot
      ? html` <${ChoroplethMap}
                bridgeCountyData=${stateBridges}
                displayStates=${queryState.state}
                plotType=${plotType}
                submitted=${renderSubmitted}
                />`
      : null
      }
      ${
      !renderSubmitted && stateBridges.hasOwnProperty("message")
      ? html`
      <${Grid} item xs=${12}>
        <${Typography} style=${"text-align: center"}
                       variant="h6"
                       color=${grey[500]}>
          <i>${stateBridges.message}</i>
        </${Typography}>
      </${Grid}>`
      : null
      }
    </${Grid}>
  </${Paper}>
</${Grid}>
${
!isEmpty(stateBridges) &&
!stateBridges.hasOwnProperty("message") &&
showPlot &&
queryState.state.length !== 0 &&
!renderWaiting
? html` <${LocaleDescription}
          summaryType=${renderPlotType}
          keyValues=${{
          field: renderPlotType,
          count: stateBridges.keyData.count,
          locality: localityString,
          filters: {...queryState, ...detailedQueryState},
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
