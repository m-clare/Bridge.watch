import { h } from "preact";
import htm from "htm";
import { getNationalBridges } from "../../utils/nbi-api";
import { useEffect, useState, useRef } from "preact/hooks";
import { StaticHexbinChart } from "../../components/StaticHexbinMap";
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
import useMediaQuery from "@mui/material/useMediaQuery";
import useWindowDimensions from "../../components/windowDimensions";
import { LocaleDescription } from "../../components/localeDescription";
import { QueryForm } from "../../components/queryForm";
import { DetailedForm } from "../../components/detailedForm";
import Divider from "@mui/material/Divider";
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

const countryFilters = (({ material, type, service, service_under }) => ({
  material,
  type,
  service,
  service_under,
}))(multiFilters);

const detailedFilters = (({ ratings, deck_type, deck_surface }) => ({
  ratings, deck_type, deck_surface
}))(multiFilters);

export default function CountryBridges() {
  const [bridges, setBridges] = useState({});
  const [queryState, setQueryState] = useState({
    plot_type: "percent_poor",
    material: [],
    type: [],
    service: [],
    service_under: [],
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
  const [queryURI, setQueryURI] = useState("plot_type=percent_poor");
  const [submitted, setSubmitted] = useState(true);
  const [hexSize, setHexSize] = useState(true);
  const [plotType, setPlotType] = useState(queryState.plot_type);
  const [waiting, setWaiting] = useState(false);
  const [desktopView, setDesktopView] = useState(true);

  const queryDicts = {
    plotOptions: plotOptions,
    filterMaps: filterMaps,
    detailedQueryMaps: detailedQueryMaps,
  };

  const heightCheck = useMediaQuery("(min-height:500px)");

  const { deviceWidth, deviceHeight } = useWindowDimensions();

  useEffect(async () => {
    const newURI = constructURI(queryState, detailedQueryState, queryDicts);
    let bridgeData = await getNationalBridges(newURI);
    setQueryURI(newURI);
    if (queryState.plot_type === "future_date_of_inspection") {
      bridgeData = fixDateData(bridgeData, "hexBin");
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

  const colWidth = { single: 3, multi: 3 };

  return html`
<${Box} sx=${{ padding: [0, 3], pt: [2, 3], pb: [2, 3] }}>
  <${Container} maxWidth="lg">
    <${Grid} container spacing=${[2, 3]}>
      <${Grid} item xs=${12}>
        <${Paper} sx=${{ padding: 3 }}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} variant="h3" component="h1">U.S. Bridges</${Typography}>
            </${Grid}>
            <${QueryForm} stateInfo=${{
                          routeType: "country",
                          state: queryState,
                          detailedQueryState: detailedQueryState,
                          submitted: renderSubmitted,
                          plotType: plotType,
                          queryURI: queryURI,
                          setState: setQueryState,
                          setWaiting: setWaiting,
                          setSubmitted: setSubmitted,
                          setPlotType: setPlotType,
                          queryDicts: queryDicts,
                          }}
                          plotChoices=${singleFilters.plot_type}
                          filters=${countryFilters}
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
                               colWidth=3
                               filters=${detailedFilters}
                               />
            </${Grid}>
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
      renderWaiting
      ? html`<${Grid} item xs=${12}>
        <${Paper} sx=${{ padding: 2 }}>
          <${Grid} container>
            <${Grid} item xs=${12}>
              <${Typography} style=${"text-align: center"}
                             variant="h6"
                             color=${grey[500]}>
                <i>Submit query to update plots.</i>
              </${Typography}>
            </${Grid}>
          </${Grid}>
        </${Paper}>
      </${Grid}>`
      : null
      }
      ${
      !isEmpty(bridges) && !bridges.hasOwnProperty("message") && !renderWaiting
      ? html`<${LocaleDescription}
               summaryType=${renderPlotType}
               keyValues=${{
               field: renderPlotType,
               count: bridges.keyData.count,
               locality: locality,
               filters: {...queryState, ...detailedQueryState},
               }}
               waiting=${renderWaiting}
               submitted=${renderSubmitted}
               />` : null}
      ${!isEmpty(bridges) && !bridges.hasOwnProperty("message") ? html`
      <${StaticHexbinChart}
        bridgeData=${bridges}
        plotType=${renderPlotType}
        hexSize=${scaledHexBool}
        submitted=${submitted}
        heightCheck=${heightCheck}
        /> `
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
