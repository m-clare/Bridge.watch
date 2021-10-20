import axios from "axios";

function getNationalBridges(uriString) {
  const url = `http://${process.env.PREACT_APP_EXPRESS_HOST}:${process.env.PREACT_APP_EXPRESS_PORT}?${uriString}`;
  console.log(url);
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => console.error(`Error: ${error}`));
}

export { getNationalBridges };
