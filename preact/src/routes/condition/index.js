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
import Divider from "@mui/material/Divider";

//Imports for collapsible form
import { styled } from "@mui/material/styles";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";


import { SunburstChart } from "../../components/sunburstChart";
import { QueryForm } from "../../components/queryForm";
import { DetailedForm } from "../../components/detailedForm";
import {
  singleFilters,
  multiFilters,
  filterMaps,
  detailedQueryMaps,
  validRanges,
  fieldOptions
} from "../../components/options";
import { constructURI, fixDateData, getFiltersAsString } from "../../components/helperFunctions";


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
  const [queryURI, setQueryURI] = useState("");
  const [submitted, setSubmitted] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const queryDicts = {
    filterMaps: filterMaps,
    detailedQueryMaps: detailedQueryMaps,
    fieldOptions: fieldOptions
  };

  // run every time submitted is updated
  useEffect(async () => {
    const newURI = constructURI(queryState, detailedQueryState, queryDicts);
    const bridgeData = await getConditionBridges(newURI);
    setQueryURI(newURI);
    setConditionBridges(bridgeData);
    setSubmitted(false);
    setWaiting(false);
  }, [submitted]);

  const renderField = searchField;
  const renderSubmitted = submitted;
  const renderWaiting = waiting;
  const colWidth = { single: 12, multi: 12 };

  const { field, ...filters } = queryState;
  const combinedFilters = {...filters, ...detailedQueryState}

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
                          queryState: queryState,
                          detailedQueryState: detailedQueryState,
                          searchField: searchField,
                          submitted: submitted,
                          queryURI: queryURI,
                          setQueryState: setQueryState,
                          setDetailedQueryState: setDetailedQueryState,
                          setWaiting: setWaiting,
                          setSubmitted: setSubmitted,
                          setSearchField: setSearchField,
                          queryDicts: queryDicts
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
                                   queryState: queryState,
                                   detailedQueryState: detailedQueryState,
                                   submitted: renderSubmitted,
                                   setWaiting: setWaiting,
                                   queryURI: queryURI,
                                   setSubmitted: setSubmitted,
                                   setDetailedQueryState: setDetailedQueryState,
                                   validRange: validRanges,
                                   queryDicts: queryDicts,
                                   setExpanded: setExpanded
                                   }}
                                   colWidth=12
                                   filters=${detailedFilters}
                                   />
                </${Grid}>
              </${Grid}>
            </${Collapse}>
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
        <${Paper} sx=${{ padding: 3, minHeight: { xs: 0, md: 900 } }}>
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
            !isEmpty(conditionBridges) &&
            !conditionBridges.hasOwnProperty("message")
            ? html`
            <${Grid} item xs=${12}>
              <${Typography} variant="h6" style=${"text-align: center"}>
                Click each wedge to zoom in. Click the center to zoom out.
              </${Typography}>
            </${Grid}>
            <${SunburstChart}
              bridgeConditionData=${conditionBridges}
              field=${renderField}
              submitted=${renderSubmitted}
              chartID="SunburstDiagram"
              />`
            : null
            }
            ${
            !renderSubmitted && conditionBridges.hasOwnProperty("message")
            ? html`
            <${Grid} item xs=${12}>
              <${Typography} style=${"text-align: center"}
                             variant="h6"
                             color=${grey[500]}>
                <i>${conditionBridges.message}</i>
              </${Typography}>
            </${Grid}>`
            : null
            }
          </${Grid}>
        </${Paper}>
      </${Grid}>
      ${
      !isEmpty(conditionBridges) &&
      !conditionBridges.hasOwnProperty("message") &&
      !submitted &&
      !renderWaiting
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
