export function constructURI(baseQuery, detailedQuery, queryDicts) {
  const { plotOptions, filterMaps, detailedQueryMaps } = queryDicts;
  const searchParams = new URLSearchParams();
  const baseKeys = Object.keys(baseQuery);
  const detailedKeys = Object.keys(detailedQuery);
  // add base query components to searchParams
  baseKeys.forEach((item) => {
    if (item === "plot_type") {
      const value = baseQuery["plot_type"];
      searchParams.set(item, plotOptions[value].query);
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
  console.log(uriString);
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
  const { state, setState, setWaiting, setShowPlot, routeType } = stateInfo;
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
  const { state, queryURI, setSubmitted, detailedQueryState, queryDicts } =
    stateInfo;
  const newURI = constructURI(state, detailedQueryState, queryDicts);
  if (newURI !== queryURI) {
    setSubmitted(true);
  }
};

export const handleSingleChange = (event, type, stateInfo) => {
  const {
    state,
    setState,
    detailedQueryState,
    queryURI,
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
  if (plotType !== value) {
    setPlotType(value);
  }
};
