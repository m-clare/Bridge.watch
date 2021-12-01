export const handleChange = (event, type, state, setState, setWaiting) => {
  const value = event.target.value;
  const valueArray = typeof value === "string" ? value.split(",").sort() : value.sort();
  setState({...state, [type]: valueArray });
  setWaiting(true)
}
