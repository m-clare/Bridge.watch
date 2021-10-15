import axios from "axios";

function getNationalBridges() {
  const url = `http://{process.env.EXPRESS_HOST}:{process.env.EXPRESS_PORT}/`;
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => console.error(`Error: ${error}`));
}

export { getNationalBridges };
