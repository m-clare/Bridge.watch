export function constructURI(baseQuery, detailedQuery, queryDicts) {
  const {
    plotOptions,
    fieldOptions,
    stateOptions,
    filterMaps,
    detailedQueryMaps,
  } = queryDicts;
  const searchParams = new URLSearchParams();
  const baseKeys = Object.keys(baseQuery);
  const detailedKeys = Object.keys(detailedQuery);
  // Get states for head to head query, undefined otherwise
  const { stateOne, stateTwo } = baseQuery;
  // add base query components to searchParams
  baseKeys.forEach((item) => {
    if (item === "plot_type") {
      const value = baseQuery["plot_type"];
      searchParams.set(item, plotOptions[value].query);
    } else if (item === "field") {
      const value = baseQuery["field"];
      searchParams.set(item, fieldOptions[value].query);
    } else if (item === "stateOne" || item === "stateTwo") {
      const value = baseQuery[item];
      searchParams.set("state", stateOptions[value]);
    } else if (baseQuery[item].length !== 0) {
      const filterMap = filterMaps[item].options;
      searchParams.set(item, baseQuery[item].map((d) => filterMap[d]).sort());
    }
  });
  // add detailed query components to searchParams
  detailedKeys.forEach((item) => {
    if (item === "rangeFilters") {
      const rangeKeys = Object.keys(detailedQuery.rangeFilters);
      rangeKeys.forEach((item) => {
        if (detailedQuery.rangeFilters[item].min !== "") {
          searchParams.set(
            detailedQueryMaps[item].min,
            detailedQuery.rangeFilters[item].min
          );
        }
        if (detailedQuery.rangeFilters[item].max !== "") {
          searchParams.set(
            detailedQueryMaps[item].max,
            detailedQuery.rangeFilters[item].max
          );
        }
      });
    } else if (detailedQuery[item].length !== 0) {
      const filterMap = filterMaps[item].options;
      searchParams.set(
        item,
        detailedQuery[item].map((d) => filterMap[d]).sort()
      );
    }
  });
  const uriString = searchParams.toString().toLowerCase();
  return uriString;
}

export function fixDateData(data, binType) {
  if (!data.totalValues) {
    return data;
  }
  data.totalValues = data.totalValues.map((d) => ({
    ...d,
    future_date_of_inspection: new Date(d.future_date_of_inspection),
  }));
  let keyValues = data.keyData;
  const statTypes = ["min", "max", "mode"];
  statTypes.forEach((d) => {
    data.keyData[d] = new Date(keyValues[d]);
  });
  data[binType].forEach((d) => {
    statTypes.forEach((f) => {
      d.objKeyValues[f] = new Date(d.objKeyValues[f]);
    });
    d.objHistogram = d.objHistogram.map((f) => ({
      ...f,
      future_date_of_inspection: new Date(f.future_date_of_inspection),
    }));
  });
  return data;
}

export const handleChange = (event, type, stateInfo) => {
  const { routeType, state, setState, setWaiting, setShowPlot } = stateInfo;
  const value = event.target.value;
  const valueArray =
    typeof value === "string" ? value.split(",").sort() : value.sort();
  if (routeType === "state" && state.state.length === 0) {
    setShowPlot(false);
  }
  setState({ ...state, [type]: valueArray });
  setWaiting(true);
};

export const handleClose = (event, stateInfo) => {
  const { state, queryURI, setSubmitted, setWaiting, detailedQueryState, queryDicts } =
    stateInfo;
  const newURI = constructURI(state, detailedQueryState, queryDicts);
  if (newURI !== queryURI) {
    setSubmitted(true);
  }
  setWaiting(true);
};

export const handleDetailedChange = (event, type, stateInfo) => {
  const { routeType, detailedQueryState, setDetailedQueryState, setWaiting} = stateInfo;
  const value = event.target.value;
  const valueArray =
    typeof value === "string" ? value.split(",").sort() : value.sort();
  setDetailedQueryState({ ...detailedQueryState, [type]: valueArray });
  setWaiting(true);
};

export const handleSingleChange = (event, type, stateInfo) => {
  const {
    routeType,
    state,
    setState,
    detailedQueryState,
    queryURI,
    searchField,
    setSearchField,
    plotType,
    setSubmitted,
    setWaiting,
    setPlotType,
    queryDicts,
  } = stateInfo;
  const value = event.target.value;
  setState({ ...state, [type]: value });
  const newURI = constructURI(
    { ...state, [type]: value },
    detailedQueryState,
    queryDicts
  );
  if (newURI !== queryURI) {
    setSubmitted(true);
    setWaiting(true);
  }
  if (routeType === "state" || routeType === "country") {
    if (type === "plot_type" && plotType !== value) {
      setPlotType(value);
    }
  }
  if (routeType === ("condition" || "headToHead")) {
    if (type === "field" && value !== searchField) {
      setSearchField(value);
    }
  }
};

export const handleClearFiltersClick = (event, stateInfo) => {
  const {
    routeType,
    state,
    setState,
    detailedQueryState,
    queryDicts,
    setSubmitted,
    queryURI,
  } = stateInfo;
  const clearedQueryState = {
    ...state,
    material: [],
    type: [],
    service: [],
    service_under: [],
  };
  setState(clearedQueryState);
  const newURI = constructURI(
    clearedQueryState,
    detailedQueryState,
    queryDicts
  );
  if (routeType === "state") {
    if (newURI !== queryURI && state.statelength !== 0) {
      setSubmitted(true);
    }
  } else if (newURI !== queryURI) {
    setSubmitted(true);
  }
};

function isPositiveInt(val) {
  return /^\d+$/.test(val);
}

export const handleRangeChange = (event, type, stateInfo, extrema) => {
  const { detailedQueryState, setDetailedQueryState, setWaiting, validRange } = stateInfo;
  const value = event.target.value;
  const minValue = detailedQueryState.rangeFilters[type].min;
  const maxValue = detailedQueryState.rangeFilters[type].max;
  // Validation for year, positive number otherwise
  if (
    ((type === "year_built" && value.length === 4) ||
      (type !== "year_built" && value.length >= 1)) &&
    isPositiveInt(value)
  ) {
    let inputValue;
    if (value > validRange.max) {
      inputValue = parseInt(validRange.max);
    } else if (value < validRange.min) {
      inputValue = parseInt(validRange.min);
    } else if (
      extrema === "min" &&
      maxValue !== "" &&
      maxValue !== null &&
      value > maxValue
    ) {
      inputValue = parseInt(maxValue);
    } else if (
      extrema === "max" &&
      minValue !== "" &&
      minValue !== null &&
      value < minValue
    ) {
      inputValue = parseInt(minValue);
    } else {
      inputValue = value;
    }
    const newNumberFilters = {
      ...detailedQueryState.rangeFilters[type],
      [extrema]: inputValue,
    };
    const detailedRanges = {
      ...detailedQueryState.rangeFilters,
      [type]: newNumberFilters,
    };
    setDetailedQueryState({
      ...detailedQueryState,
      rangeFilters: detailedRanges,
    });
    setWaiting(true);
  } else if (value === null || value === "") {
    const inputValue = "";
    const newNumberFilters = {
      ...detailedQueryState.rangeFilters[type],
      [extrema]: inputValue,
    };
    const detailedRanges = {
      ...detailedQueryState.rangeFilters,
      [type]: newNumberFilters,
    };
    setDetailedQueryState({
      ...detailedQueryState,
      rangeFilters: detailedRanges,
    });
    setWaiting(true);
  }
};

export const handleDetailedSubmitClick = (event, stateInfo) => {
  const { state, detailedQueryState, queryURI, setSubmitted, queryDicts } =
    stateInfo;
  const newURI = constructURI(state, detailedQueryState, queryDicts);
  if (newURI !== queryURI) {
    setSubmitted(true);
  }
};

export const handleDetailedClearClick = (event, stateInfo) => {
  const { setDetailedQueryState, state, queryDicts, setSubmitted, queryURI } =
    stateInfo;
  const emptyDetailedFilters = {
    ratings: [],
    deck_type: [],
    deck_surface: [],
    rangeFilters: {
      year_built: { min: "", max: "" },
      traffic: { min: "", max: "" },
      bridge_length: { min: "", max: "" },
      span_length: { min: "", max: "" },
    },
  };
  setDetailedQueryState(emptyDetailedFilters);
  const newURI = constructURI(state, emptyDetailedFilters, queryDicts);
  if (newURI !== queryURI) {
    setSubmitted(true);
  }
};

const getPropCapped = (prop) => {
  return prop
    .split("_")
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

export function getFiltersAsString(filters) {
  let filterStringArray = [];
  for (const prop in filters) {
    if (prop === "rangeFilters") {
      const contents = Object.keys(filters[prop]);
      contents.map((field) => {
        const fieldCapped = getPropCapped(field);
        let minPropString;
        let maxPropString;
        let count = 0;
        // check if min and max have been added
        if (filters.rangeFilters[field].min !== null && filters.rangeFilters[field].min !== "") {
          minPropString = "Minimum = " + filters.rangeFilters[field].min
          count += 1;
        }
        if (filters.rangeFilters[field].max !== null && filters.rangeFilters[field].max !== "") {
          maxPropString = "Maximum = " + filters.rangeFilters[field].max;
          count += 1;
        }
        if (count > 0) {
          let fieldString = fieldCapped + ": "
          if (minPropString && maxPropString) {
            fieldString = fieldString + minPropString + ", " + maxPropString
          } else if (minPropString) {
            fieldString = fieldString + minPropString
          } else if (maxPropString) {
            fieldString = fieldString + maxPropString
          }
          filterStringArray.push(fieldString)
        }
      });
    } else if (filters[prop].length !== 0) {
      const propCapped = getPropCapped(prop);
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
