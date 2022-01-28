export function queryDictFromURI(
  savedQuery,
  filters,
  originalQuery,
  originalDetailedQuery
) {
  let queryKeys = Object.keys(originalQuery);
  let queryState = {};
  for (const key of queryKeys) {
    if (key === "plot_type" || key === "field") {
      queryState[key] = "";
    } else {
      queryState[key] = [];
    }
  }
  let detailedQueryKeys = Object.keys(originalDetailedQuery);
  let detailedQueryState = {};
  for (const key of detailedQueryKeys) {
    if (key === "rangeFilters") {
      const rangeKeys = Object.keys(originalDetailedQuery[key]);
      detailedQueryState["rangeFilters"] = [];
      for (const rangeKey of rangeKeys) {
        detailedQueryState.rangeFilters[rangeKey] = { min: "", max: "" };
      }
    } else {
      detailedQueryState[key] = [];
    }
  }
  const unprocessedJSON = JSON.parse(
    '{"' +
      decodeURI(savedQuery)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
  const rangeKeys = ["year_built", "span_length", "bridge_length", "traffic"];
  const detailedKeys = ["ratings", "deck_type", "deck_surface"];
  const baseKeys = [
    "plot_type",
    "material",
    "type",
    "service",
    "service_under",
    "state",
    "field",
  ];
  const URIQueryKeys = Object.keys(unprocessedJSON);
  for (const key of URIQueryKeys) {
    // first get plot_type
    if (key === "plot_type" || key === "field") {
      queryState = { ...queryState, [key]: decodeURI(unprocessedJSON[key]) };
    } else if (baseKeys.includes(key)) {
      const filteredValues = getFilteredValues(filters, unprocessedJSON, key);
      queryState = { ...queryState, [key]: filteredValues };
    } else if (detailedKeys.includes(key)) {
      const filteredValues = getFilteredValues(filters, unprocessedJSON, key);
      detailedQueryState = { ...detailedQueryState, [key]: filteredValues };
    } else if (
      (key.split("_")[0] === "min" || key.split("_")[0] === "max") &&
      rangeKeys.includes(key.substring(4))
    ) {
      let rangeFilters = detailedQueryState.rangeFilters;
      const type = key.substring(0, 3);
      const field = key.substring(4);
      const rangeValues = {
        ...rangeFilters[field],
        [type]: parseInt(decodeURI(unprocessedJSON[key])),
      };
      rangeFilters = { ...rangeFilters, [field]: rangeValues };
      detailedQueryState = {
        ...detailedQueryState,
        rangeFilters,
      };
    }
  }
  return [queryState, detailedQueryState];
}

function getFilteredValues(filters, unprocessedJSON, key) {
  const reversedMap = reverseOptionMap(filters[key].options);
  const filteredList = decodeURIComponent(unprocessedJSON[key])
    .split(",")
    // .map((d) => parseInt(d));
  let filteredValues = [];
  for (const item of filteredList) {
    if (!filteredValues.includes(reversedMap[item])) {
      filteredValues.push(reversedMap[item]);
    }
  }
  return filteredValues;
}

function reverseOptionMap(optionMap) {
  // get reverse map of a given multifilter
  const keys = Object.keys(optionMap);
  const reversed = {};
  for (const key of keys) {
    if (Array.isArray(optionMap[key])) {
      const values = optionMap[key];
      for (const value of values) {
        reversed[value] = key;
      }
    } else {
      const value = optionMap[key];
      reversed[value] = key;
    }
  }
  return reversed;
}

export function constructURI(baseQuery, detailedQuery, queryDicts) {
  const {
    plotOptions,
    fieldOptions,
    stateOptions,
    multiFilters,
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
      const filterMap = multiFilters[item].options;
      searchParams.set(
        item,
        baseQuery[item].map((d) => {
          if (Array.isArray(filterMap[d])) {
            return filterMap[d].sort().join();
          } else {
            return filterMap[d];
          }
        })
      );
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
      const filterMap = multiFilters[item].options;
      searchParams.set(
        item,
        detailedQuery[item].map((d) => {
          if (Array.isArray(filterMap[d])) {
            return filterMap[d].sort().join();
          } else {
            return filterMap[d];
          }
        })
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
  const { routeType, queryState, setQueryState, setWaiting, setShowPlot } =
    stateInfo;
  const value = event.target.value;
  const valueArray =
    typeof value === "string" ? value.split(",").sort() : value.sort();
  if (routeType === "state" && queryState.state.length === 0) {
    setShowPlot(false);
  }
  setQueryState({ ...queryState, [type]: valueArray });
};

export const handleClose = (event, stateInfo) => {
  const {
    queryState,
    queryURI,
    setSubmitted,
    setWaiting,
    detailedQueryState,
    queryDicts,
  } = stateInfo;
  const newURI = constructURI(queryState, detailedQueryState, queryDicts);
  if (newURI !== queryURI) {
    setSubmitted(true);
    setWaiting(true);
  } else {
    setWaiting(false);
  }
};

export const handleDetailedChange = (event, type, stateInfo) => {
  const {
    routeType,
    detailedQueryState,
    setDetailedQueryState,
    setWaiting,
    queryDicts,
    queryState,
    queryURI,
  } = stateInfo;
  const value = event.target.value;
  const valueArray =
    typeof value === "string" ? value.split(",").sort() : value.sort();
  setDetailedQueryState({ ...detailedQueryState, [type]: valueArray });
  // check if query has changed:
  const newURI = constructURI(
    queryState,
    { ...detailedQueryState, [type]: valueArray },
    queryDicts
  );
  if (newURI !== queryURI) {
    setWaiting(true);
  } else {
    setWaiting(false);
  }
};

export const handleSingleChange = (event, type, stateInfo) => {
  const {
    routeType,
    queryState,
    setQueryState,
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
  setQueryState({ ...queryState, [type]: value });
  const newURI = constructURI(
    { ...queryState, [type]: value },
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

export const handleClearAllFiltersClick = (event, stateInfo) => {
  const {
    routeType,
    queryState,
    setQueryState,
    detailedQueryState,
    setDetailedQueryState,
    queryDicts,
    setSubmitted,
    queryURI,
  } = stateInfo;
  let clearedQueryState;
  if (routeType === "state" || routeType === "country") {
    clearedQueryState = {
      ...queryState,
      material: [],
      type: [],
      service: [],
      service_under: [],
    };
  } else {
    clearedQueryState = {
      ...queryState,
      state: [],
      material: [],
      type: [],
      service: [],
      service_under: [],
    };
  }
  setQueryState(clearedQueryState);
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
  const newURI = constructURI(
    clearedQueryState,
    emptyDetailedFilters,
    queryDicts
  );
  if (routeType === "state") {
    if (newURI !== queryURI && queryState.state.length !== 0) {
      setSubmitted(true);
    }
  } else if (newURI !== queryURI) {
    setSubmitted(true);
  }
};

export const handleClearFiltersClick = (event, stateInfo) => {
  const {
    routeType,
    queryState,
    setQueryState,
    detailedQueryState,
    queryDicts,
    setSubmitted,
    queryURI,
  } = stateInfo;
  const clearedQueryState = {
    ...queryState,
    material: [],
    type: [],
    service: [],
    service_under: [],
  };
  setQueryState(clearedQueryState);
  const newURI = constructURI(
    clearedQueryState,
    detailedQueryState,
    queryDicts
  );
  if (routeType === "state") {
    if (newURI !== queryURI && queryState.state.length !== 0) {
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
  const {
    queryState,
    detailedQueryState,
    queryURI,
    setDetailedQueryState,
    setWaiting,
    validRange,
    queryDicts,
  } = stateInfo;
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
    // check if query has changed:
    const newURI = constructURI(
      queryState,
      { ...detailedQueryState, rangeFilters: detailedRanges },
      queryDicts
    );
    if (newURI !== queryURI) {
      setWaiting(true);
    } else {
      setWaiting(false);
    }
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
    // check if query has changed:
    const newURI = constructURI(
      queryState,
      { ...detailedQueryState, rangeFilters: detailedRanges },
      queryDicts
    );
    if (newURI !== queryURI) {
      setWaiting(true);
    } else {
      setWaiting(false);
    }
  }
};

export const handleDetailedSubmitClick = (event, stateInfo) => {
  const {
    queryState,
    detailedQueryState,
    queryURI,
    setSubmitted,
    setExpanded,
    queryDicts,
  } = stateInfo;
  const newURI = constructURI(queryState, detailedQueryState, queryDicts);
  if (newURI !== queryURI) {
    setSubmitted(true);
    setExpanded(false);
  }
};

export const handleDetailedClearClick = (event, stateInfo) => {
  const {
    setDetailedQueryState,
    queryState,
    queryDicts,
    setSubmitted,
    setExpanded,
    queryURI,
  } = stateInfo;
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
  const newURI = constructURI(queryState, emptyDetailedFilters, queryDicts);
  if (newURI !== queryURI) {
    setSubmitted(true);
    setExpanded(false);
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
        if (
          filters.rangeFilters[field].min !== null &&
          filters.rangeFilters[field].min !== ""
        ) {
          minPropString = "Minimum = " + filters.rangeFilters[field].min;
          count += 1;
        }
        if (
          filters.rangeFilters[field].max !== null &&
          filters.rangeFilters[field].max !== ""
        ) {
          maxPropString = "Maximum = " + filters.rangeFilters[field].max;
          count += 1;
        }
        if (count > 0) {
          let fieldString = fieldCapped + ": ";
          if (minPropString && maxPropString) {
            fieldString = fieldString + minPropString + ", " + maxPropString;
          } else if (minPropString) {
            fieldString = fieldString + minPropString;
          } else if (maxPropString) {
            fieldString = fieldString + maxPropString;
          }
          filterStringArray.push(fieldString);
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
