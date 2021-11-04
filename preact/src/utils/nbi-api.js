import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

function getNationalBridges(uriString) {
  const url = `${process.env.PREACT_APP_API_URL}/national?${uriString}`;
  console.log(url);
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => console.error(`Error: ${error}`));
}

function getStateBridges(uriString) {
  const url = `${process.env.PREACT_APP_API_URL}/state?${uriString}`;
  console.log(url);
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => console.error(`Error: ${error}`));
}

export { getNationalBridges, getStateBridges };
