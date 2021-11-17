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

import { TopForm } from "../../components/topForm";
import { singleFilters, multiFilters, stateSingleFilters } from "../../components/options";
import { SunburstChart } from "../../components/sunburstChart";
const html = htm.bind(h);

const attrFilters = (({ material, type, service }) => ({
  material,
  type,
  service,
}))(multiFilters);

function constructURIs(query) {
  let {stateOne, stateTwo, ...rest} = query
  const keys = Object.keys(query);
  const stateArray = [stateOne, stateTwo]
  const uriArray = stateArray.map((d) => {
    const searchParams = new URLSearchParams();
    keys.forEach((item) => {
      if (item === "field") {
        const value = query["field"];
        searchParams.set(item, singleFilters.field.options[value].query)
      } else if (item === "stateOne" || item === "stateTwo") {
        searchParams.set('state', stateSingleFilters[item].options[d])
      }
      else if (query[item].length !== 0) {
        const filterMap = multiFilters[item].options;
        searchParams.set(item, query[item].map((d) => filterMap[d]).sort());
      }
    });


    return searchParams.toString().toLowerCase()
  })
  return uriArray;
}

function getFiltersAsString(filters) {
  let filterStringArray = [];
  for (const prop in filters) {
    if (filters[prop].length !== 0) {
      const propCapped = prop
        .split(" ")
        .map((word) => {
          return word[0].toUpperCase() + word.substring(1);
        })
        .join(" ");
      let filteredPropString;
      if (prop.length > 1) {
        filteredPropString = [
          filters[prop].slice(0, -1).join(", "),
          filters[prop].slice(-1)[0],
        ].join(filters[prop].length < 2 ? "" : "  or ");
      } else {
        filteredPropString = prop;
      }
      filterStringArray.push(`${propCapped}: ${filteredPropString}`);
    }
  }
  return filterStringArray;
}

export default function HeadToHead() {
  const [conditionBridgesOne, setConditionBridgesOne] = useState({});
  const [conditionBridgesTwo, setConditionBridgesTwo] = useState({});
  const [queryState, setQueryState] = useState({
    field: 'material',
    material: [],
    type: [],
    service: [],
    stateOne: `California`,
    stateTwo: `New York`,
  });
  const [searchField, setSearchField] = useState(queryState.field)
  const [queryURIs, setQueryURIs] = useState({'stateOne': '', 'stateTwo': ''});
  const [submitted, setSubmitted] = useState(true);
  const [waiting, setWaiting] = useState(false);

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
    const newURIs = constructURIs({ ...queryState, [type]: value });
    if (newURIs[0] !== queryURIs['stateOne'] || newURIs[1] !== queryURIs['stateTwo']) {
      setSubmitted(true);
      setWaiting(true);
    }
    if (type === "field" && value !== searchField) {
      setSearchField(value);
    }
  };

  const handleLimitedMultiSelect = (event) => {
    const value = event.target.value.sort() // array;
    console.log(value)
  }

  const handleFormClose = (event) => {
    const newURIs = constructURIs(queryState);
    if (newURIs[0] !== queryURIs['stateOne'] || newURIs[1] !== queryURIs['stateTwo']) {
      setSubmitted(true);
    }
  };

  const handleClick = (event) => {
    const clearedQueryState = {...queryState, 'material': [], 'type': [], 'service': []}
    setQueryState(clearedQueryState)
    const newURIs= constructURIs(clearedQueryState);
    if (newURIs[0] !== queryURIs['stateOne'] || newURIs[1] !== queryURIs['stateTwo']) {
      setSubmitted(true);
    }
  }

  // run every time submitted is updated
  useEffect(async () => {
    const newURIs = constructURIs(queryState);
    const bridgeDataOne = await getConditionBridges(newURIs[0]);
    const bridgeDataTwo = await getConditionBridges(newURIs[1]);
    setQueryURIs({'stateOne': newURIs[0], 'stateTwo': newURIs[1]});
    setConditionBridgesOne(bridgeDataOne);
    setConditionBridgesTwo(bridgeDataTwo);
    setSubmitted(false);
    setWaiting(false);
  }, [submitted]);

  const renderField = searchField;
  const renderSubmitted = submitted;
  const renderWaiting = waiting;
  const colWidth = { single: 4, multi: 4 };

  const {field, stateOne, stateTwo, ...queryAttrFilters} = queryState;

  return html`
<${Box} sx=${{ padding: 3 }}>
  <${Container} maxWidth="lg">
    <${Grid} container spacing=${3}>
      <${Grid} item xs=${12}>
        <${Paper} sx=${{ padding: 3, minHeight: {xs: 0}}}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} variant="h4" component="h1">State Sunburst Comparison</${Typography}>
            </${Grid}>
            <${Grid} item xs=${12}>
              <${TopForm}
                queryState=${queryState}
                handleChange=${handleChange}
                handleClose=${handleFormClose}
                handleSingleChange=${handleSingleChange}
                submitted=${renderSubmitted}
                plotChoices=${singleFilters.field}
                stateChoices=${stateSingleFilters}
                filters=${Object.values(attrFilters)}
                handleClick=${handleClick}
                colWidth=${colWidth} />
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
      <${Grid} item xs=${12}>
        <${Paper} sx=${{ padding: 3, minHeight: {xs: 0} }}>
          <${Grid} container spacing=${3}>
            ${
            !isEmpty(conditionBridgesOne) && !isEmpty(conditionBridgesTwo)
            ? html`
            <${Grid} item xs=${12} md=${6}>
                <${Typography} variant="h5">${queryState.stateOne}</${Typography}>
                <${SunburstChart}
                  bridgeConditionData=${conditionBridgesOne}
                  field=${renderField}
                  submitted=${renderSubmitted}
                  chartID="State1"
                  />
            </${Grid}>
            <${Grid} item xs=${12} md=${6}>
               <${Typography} variant="h5">${queryState.stateTwo}</${Typography}>
                <${SunburstChart}
                  bridgeConditionData=${conditionBridgesTwo}
                  field=${renderField}
                  submitted=${renderSubmitted}
  chartID="State2"
  />
  </${Grid}>
  `
            : null
            }
          </${Grid}>
        </${Paper}>
      </${Grid}>
      ${
      !isEmpty(conditionBridgesOne) && !isEmpty(conditionBridgesTwo) &&
      !submitted
      ? html`
      <${Grid} item xs=${12}>
        <${Paper} sx=${{ padding: 3}}>
          <${Grid} container spacing=${3}>
            <${Grid} item xs=${12}>
              <${Typography} style=${"font-weight: 400"}
                             variant="h4"
                             component="h1"
                             gutterBottom
                             >
                Explanation
              </${Typography}>
              ${getFiltersAsString(queryAttrFilters).map(
              (d) =>
              html`<${Typography} 
                     variant="h6"
                     component="h3"
                     style=${"font-weight:400"}>
                ${d}</${Typography}>`
              )}
              <${Typography} variant="body1" paragraph>
                The plots above are zoomable sunburst diagrams (similar to a pie chart), which allows you to zoom into the lowest levels of the hierarchy by clicking on a segment of the diagram. To back out a level, you can click the center of the diagram. The small map in the upper left hand corner is for orientation within the entire diagram. </${Typography}>
              <${Typography} variant="body1" paragraph>
                The sunburst diagram allows for a closer look at which bridge components determine the overall rating given to the bridge. The overall bridge rating is determined by the lowest of three values: superstructure condition, substructure condition, and deck condition. The lowest levels of the hierarchy indicate whether the overall rating is due to "all components" being rated at that value (i.e. super/sub and deck are all at a 5) or if only some of the components are at the lowest rating (i.e. superstructure is a 6, substructure is a 7, and deck is an 8, leading to an overall rating of Satisfactory Condition - 6 with "superstructure at 6").  </${Typography}>
            </${Grid}>
          </${Grid}>
        </${Paper}>
      </${Grid}>
      ` : null}
    </${Grid}>
  </${Container}>
</${Box}>`;
}
