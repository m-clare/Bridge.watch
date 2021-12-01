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
import { singleFilters, multiFilters, detailedQueries, validRanges } from "../../components/options";

const html = htm.bind(h);

const countryFilters = (({ material, type, service, service_under }) => ({
  material,
  type,
  service,
  service_under,
}))(multiFilters);

function constructURI(query) {
  const searchParams = new URLSearchParams();
  const keys = Object.keys(query);
  keys.forEach((item) => {
    if (item === "plot_type") {
      const value = query["plot_type"];
      searchParams.set(item, singleFilters.plot_type.options[value].query);
    } else if (item === "rangeFilters") {
      const rangeKeys = Object.keys(query.rangeFilters)
      rangeKeys.forEach((item) => {
        if (query.rangeFilters[item].min !== '') {
        searchParams.set(detailedQueries[item].min, query.rangeFilters[item].min);
        }
        if (query.rangeFilters[item].max !== '') {
        searchParams.set(detailedQueries[item].max, query.rangeFilters[item].max);
        }
      })
    } else {
      if (query[item].length !== 0) {
        const filterMap = countryFilters[item].options;
        searchParams.set(item, query[item].map((d) => filterMap[d]).sort());
      }
    }
  });
  const uriString = searchParams.toString().toLowerCase();
  console.log(uriString)
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

function isPositiveInt(val) {
  return /^\d+$/.test(val);
}

export default function CountryBridges() {
  const [bridges, setBridges] = useState({});
  const [queryState, setQueryState] = useState({
    plot_type: "percent_poor",
    material: [],
    type: [],
    service: [],
    service_under: [],
    rangeFilters: {
      year_built: {min: '', max: ''},
      traffic: {min: '', max: ''},
      bridge_length: {min: '', max: ''},
      span_length: {min: '', max: ''},
    }
  });
  const [detailedFilters, setDetailedFilters] = useState({year_built: {min: '', max: ''},
                                                            traffic: {min: '', max: ''},
                                                            bridge_length: {min: '', max: ''},
                                                            span_length: {min: '', max: ''}})
  const [queryURI, setQueryURI] = useState("plot_type=percent_poor");
  const [submitted, setSubmitted] = useState(true);
  const [hexSize, setHexSize] = useState(true);
  const [plotType, setPlotType] = useState(queryState.plot_type);
  const [waiting, setWaiting] = useState(false);
  const [desktopView, setDesktopView] = useState(true);

  const heightCheck = useMediaQuery("(min-height:500px)");

  const { deviceWidth, deviceHeight } = useWindowDimensions();

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

  const handleRangeChange = (event, type, extrema, validRange) => {
    const value = event.target.value;
    if (type === "year_built" && value.length === 4 && isPositiveInt(value)) {
      let newYearFilters;
      if (extrema === "min") {
        const maxValue = detailedFilters[type].max
        if (maxValue !== '' && maxValue !== null && value > maxValue) {
          newYearFilters = {...detailedFilters[type], [extrema]: parseInt(maxValue)}
        } else if (value > validRange.max) {
          newYearFilters = {...detailedFilters[type], [extrema]: parseInt(validRange.max)}
        } else if (value < validRange.min) {
          newYearFilters = {...detailedFilters[type], [extrema]: parseInt(validRange.min)}
        } else {
        newYearFilters = {...detailedFilters[type], [extrema]: parseInt(value)}
        }
        setDetailedFilters({...detailedFilters, [type]: newYearFilters})
      }
      if (extrema === "max") {
        const minValue = detailedFilters[type].min
        if (minValue !== '' && minValue !== null && value < minValue) {
          newYearFilters = {...detailedFilters[type], [extrema]: parseInt(minValue)}
        } else if (value > validRange.max) {
          newYearFilters = {...detailedFilters[type], [extrema]: parseInt(validRange.max)}
        } else if (value < validRange.min) {
          newYearFilters = {...detailedFilters[type], [extrema]: parseInt(validRange.min)}
        } else if (value === null || value === '') {
          newYearFilters = {...detailedFilters[type], [extrema]: ''}
        } else {
          newYearFilters = {...detailedFilters[type], [extrema]: parseInt(value)}
        }
        setDetailedFilters({...detailedFilters, [type]: newYearFilters})
      }
    } else if (type !== "year_built" && value.length >= 1 && isPositiveInt(value)) {
      let newNumberFilters;
      if (extrema === "min") {
        const maxValue = detailedFilters[type].max
        if (maxValue !== '' && maxValue !== null && value > maxValue) {
          newNumberFilters = {...detailedFilters[type], [extrema]: parseInt(maxValue)}
        } else if (value > validRange.max) {
          newNumberFilters = {...detailedFilters[type], [extrema]: parseInt(validRange.max)}
        } else if (value < validRange.min) {
          newNumberFilters = {...detailedFilters[type], [extrema]: parseInt(validRange.min)}
        } else {
          newNumberFilters = {...detailedFilters[type], [extrema]: parseInt(value)}
        }
        setDetailedFilters({...detailedFilters, [type]: newNumberFilters})
      }
      if (extrema === "max") {
        const minValue = detailedFilters[type].min
        if (minValue !== '' && minValue !== null && value < minValue) {
          newNumberFilters = {...detailedFilters[type], [extrema]: parseInt(minValue)}
        } else if (value > validRange.max) {
          newNumberFilters = {...detailedFilters[type], [extrema]: parseInt(validRange.max)}
        } else if (value < validRange.min) {
          newNumberFilters = {...detailedFilters[type], [extrema]: parseInt(validRange.min)}
        } else {
          newNumberFilters = {...detailedFilters[type], [extrema]: parseInt(value)}
        }
        setDetailedFilters({...detailedFilters, [type]: newNumberFilters})
      }
    } else if (value === null || value === '') {
      const newValueFilters = {...detailedFilters[type], [extrema]: ''}
      setDetailedFilters({...detailedFilters, [type]: newValueFilters})
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
      service_under: [],
    };
    setQueryState(clearedQueryState);
    const newURI = constructURI(clearedQueryState);
    if (newURI !== queryURI) {
      setSubmitted(true);
    }
  };

  const handleSubmitClick = (event) => {
    const mergedQueryState = {...queryState, rangeFilters: detailedFilters}
    setQueryState(mergedQueryState);
    const newURI = constructURI(mergedQueryState);
    if (newURI !== queryURI) {
      setSubmitted(true);
    }
  };

  const handleClearClick = (event) => {
    const emptyDetailedFilters = {
      year_built: {min: '', max: ''},
      traffic: {min: '', max: ''},
      bridge_length: {min: '', max: ''},
      span_length: {min: '', max: ''},
    }
    const clearedQueryState = {
      ...queryState,
      rangeFilters: emptyDetailedFilters
    }
    setQueryState(clearedQueryState);
    setDetailedFilters(emptyDetailedFilters)
    const newURI = constructURI(clearedQueryState);
    if (newURI !== queryURI) {
      setSubmitted(true);
    }
  }

  useEffect(async () => {
    const newURI = constructURI(queryState);
    let bridgeData = await getNationalBridges(newURI);
    console.log(bridgeData)
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
           <${Grid} item xs=${12}>
           <${DetailedForm} detailedQueryState=${detailedFilters}
                            handleRangeChange=${handleRangeChange}
                            handleSubmitClick=${handleSubmitClick}
                            handleClearClick=${handleClearClick}
                            validRanges=${validRanges}
                            submitted=${renderSubmitted}
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
