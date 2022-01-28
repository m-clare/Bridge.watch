import { h } from "preact";
import htm from "htm";
import { useEffect, useState } from "preact/hooks";
import { isEmpty } from "lodash-es";
import * as d3 from "d3";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

//Imports for collapsible form
import { styled } from "@mui/material/styles";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import { getConditionBridges } from "../../utils/nbi-api";
import { SunburstChart } from "../../components/sunburstChart";
import { QueryForm } from "../../components/queryForm";
import { DetailedForm } from "../../components/detailedForm";
import {
  singleFilters,
  multiFilters,
  detailedQueryMaps,
  validRange,
  fieldOptions,
} from "../../components/options";
import {
  constructURI,
  getFiltersAsString,
  queryDictFromURI,
} from "../../components/helperFunctions";

const html = htm.bind(h);

const stateFilters = (({ state, material, type, service, service_under }) => ({
  state,
  material,
  type,
  service,
  service_under,
}))(multiFilters);

const detailedFilters = (({ ratings, deck_type, deck_surface }) => ({
  ratings,
  deck_type,
  deck_surface,
}))(multiFilters);

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return html`<${IconButton} ...${other} />`;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ConditionBridges() {
  const [conditionBridges, setConditionBridges] = useState({});
  const [queryState, setQueryState] = useState({
    field: "material",
    material: [],
    type: [],
    service: [],
    service_under: [],
    state: [],
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
  const [searchField, setSearchField] = useState(queryState.field);
  const [queryURI, setQueryURI] = useState("field=material");
  const [submitted, setSubmitted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const queryDicts = {
    multiFilters,
    detailedQueryMaps,
    fieldOptions,
  };

  // Check if Filtered view has been passed in initial URL (will run once)
  useEffect(() => {
    const qs = window.location.search.substring(1);
    if (qs) {
      const [newQueryState, newDetailedQueryState] = queryDictFromURI(
        qs,
        multiFilters,
        queryState,
        detailedQueryState
      );
      setQueryState(newQueryState);
      setDetailedQueryState(newDetailedQueryState);
      setSearchField(newQueryState.field);
      setQueryURI(qs);
    }
    setSubmitted(true);
  }, []);

  // run every time submitted is updated to true
  useEffect(() => {
    async function getBridgeData(newURI) {
      let bridgeData = await getConditionBridges(newURI)
      setConditionBridges(bridgeData)
    }
    if (submitted) {
      const newURI = constructURI(queryState, detailedQueryState, queryDicts);
      // add to URL as query string
      window.history.pushState("object", "", "?".concat(newURI));
      setQueryURI(newURI);
      getBridgeData(newURI)
      setSubmitted(false);
      setWaiting(false);
    }
  }, [submitted]);

  const colWidth = { single: 12, multi: 12 };

  const { field, ...filters } = queryState;
  const combinedFilters = { ...filters, ...detailedQueryState };
  const recordCount = d3.hierarchy(conditionBridges).sum((d) => d.value).value

  return html`
<${Box} sx=${{ padding: 3 }}>
  <${Container} maxWidth="lg">
    <${Grid} container spacing=${3}>
      <${Grid} item xs=${12} md=${4}>
        <${Paper} sx=${{ padding: 3, minHeight: { xs: 0, md: 900 } }}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} variant="h4" component="h1">Bridge Conditions</${Typography}>
            </${Grid}>
            <${QueryForm} stateInfo=${{
    routeType: "condition",
    queryState,
    detailedQueryState,
    searchField,
    submitted,
    queryURI,
    setQueryState,
    setDetailedQueryState,
    setWaiting,
    setSubmitted,
    setSearchField,
    queryDicts,
  }}
                          plotChoices=${singleFilters.field}
                          filters=${stateFilters}
                          colWidth=${colWidth}
                          />
            <${Grid} item xs=${12}>
              <${CardActions} disableSpacing style=${"padding: 0px"}>
                <${Button} variant="outlined" onClick=${handleExpandClick} fullWidth>Show advanced detailed filters
                  <${ExpandMore}
                    expand=${expanded}
                    aria-expanded=${expanded}
                    aria-label="more filters"
                    >
                    <${ExpandMoreIcon} />
                  </${ExpandMore}>
                </${Button}>
              </${CardActions}>
            </${Grid}>
            <${Collapse} in=${expanded} timeout="auto" unmountOnExit>
              <${Grid} container spacing=${3} style=${"padding: 24px"}>
                <${Grid} item xs=${12}>
                  <${Divider} variant="middle">Detailed Filters</${Divider}>
                  <${Typography} variant="h6">Note: </${Typography}>
                  <${Typography} paragraph>You <b>must</b> click "Submit Detailed Query" to apply the following filters.</${Typography}>
                </${Grid}>
                <${Grid} item xs=${12}>
                  <${DetailedForm} stateInfo=${{
    queryState,
    detailedQueryState,
    submitted,
    setWaiting,
    queryURI,
    setSubmitted,
    setDetailedQueryState,
    validRange,
    queryDicts,
    setExpanded,
  }}
                                   colWidth=12
                                   filters=${detailedFilters}
                                   />
                </${Grid}>
              </${Grid}>
            </${Collapse}>
            <${Grid} item xs=${12}>
              ${
                submitted
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
        <${Paper} sx=${{ padding: 3, minHeight: { xs: 0, md: 900 } }}>
          <${Grid} container spacing=${3}>
            ${
              waiting && !submitted
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
              !isEmpty(conditionBridges) &&
              recordCount !== 0
                ? html`
            <${Grid} item xs=${12}>
              <${Typography} variant="h6" style=${"text-align: center"}>
                Click each wedge to zoom in. Click the center to zoom out.
              </${Typography}>
            </${Grid}>
            <${SunburstChart}
              bridgeConditionData=${conditionBridges}
              chartID="SunburstDiagram"
              />`
                : null
            }
            ${
              !submitted && recordCount === 0
                ? html`
            <${Grid} item xs=${12}>
              <${Typography} style=${"text-align: center"}
                             variant="h6"
                             color=${grey[500]}>
                <i>No bridges with ratings available to create a sunburst plot!</i>
              </${Typography}>
            </${Grid}>`
                : null
            }
          </${Grid}>
        </${Paper}>
      </${Grid}>
      ${
        !isEmpty(conditionBridges) &&
        recordCount !== 0  &&
        !submitted &&
        !waiting
          ? html`
      <${Grid} item xs=${12}>
        <${Paper} sx=${{ padding: 3 }}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} style=${"font-weight: 400"}
                             variant="h4"
                             component="h1"
                             gutterBottom
                             >
                Sunburst Condition Ratings
              </${Typography}>
              ${
                queryState.state.length === 0
                  ? html`
              <${Typography}
                variant="h6"
                component="h3"
                style=${"font-weight:400"}>
                United States (and territories)</${Typography}>
              `
                  : null
              }
              ${getFiltersAsString(combinedFilters).map(
                (d) =>
                  html`<${Typography}
                     variant="h6"
                     component="h3"
                     style=${"font-weight:400"}>
                ${d}</${Typography}>`
              )}
              <${Typography} variant="body1" paragraph>
                The plot above is a zoomable sunburst diagram (similar to a pie chart), which allows you to zoom into the lowest levels of the hierarchy by clicking on a segment of the diagram. To back out a level, you can click the center of the diagram. The small map in the upper left hand corner is for orientation within the entire diagram. </${Typography}>
              <${Typography} variant="body1" paragraph>
                The sunburst diagram allows for a closer look at which bridge components determine the overall rating given to the bridge. The overall bridge rating is determined by the lowest of three values: superstructure condition, substructure condition, and deck condition. The lowest levels of the hierarchy indicate whether the overall rating is due to "all components" being rated at that value (i.e. super/sub and deck are all at a 5) or if only some of the components are at the lowest rating (i.e. superstructure is a 6, substructure is a 7, and deck is an 8, leading to an overall rating of Satisfactory Condition - 6 with "superstructure at 6").  </${Typography}>
            </${Grid}>
          </${Grid}>
        </${Paper}>
      </${Grid}>
      `
          : null
      }
    </${Grid}>
  </${Container}>
</${Box}>`;
}
