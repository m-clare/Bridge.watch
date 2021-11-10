// helpers for express server
import fetch from "node-fetch";
import dotenv from 'dotenv';
import { getHexbinData } from "./hexbin.js";
import { getStatebinData } from "./statebin.js";

dotenv.config();

const host = process.env.DATA_HOST
const port = process.env.DATA_PORT

// possible arguments async (state = null) to abvoid multiple functions
const getCountryData = async (qs) => {
  console.log(`http://${host}:${port}/api/bridges/${qs}`)
  return await fetch(`http://${host}:${port}/api/bridges/${qs}`)
    .then((response) => {
      if (response.ok) {
        return response
      } else if (response.status >= 400 && response.status < 600) {
        throw new Error("Bad response from server");
      } else if (typeof response === 'undefined') {
        throw new Error('Response was undefined')
      } else {
        throw new Error('Unknown error in fetch response.')
      }
    })
    .then((returnedResponse) => returnedResponse.text())
    .then((text) => {
      const startTime = Date.now();
      let values = getHexbinData(text);
      const msElapsed = Date.now() - startTime;
      console.log(`Hexbinning function took ${msElapsed / 1000} seconds to complete.`);
      return values;
    }).catch((error) => {
      console.log(error)
    })
};

const getStateData = async (qs) => {
  console.log(qs)
  console.log(`http://${host}:${port}/api/bridges/${qs}`)
  return await fetch(`http://${host}:${port}/api/bridges/${qs}`)
    .then((response) => {
      if (response.ok) {
        return response
      } else if (response.status >= 400 && response.status < 600) {
        throw new Error("Bad response from server");
      } else if (typeof response === 'undefined') {
        throw new Error('Response was undefined')
      } else {
        throw new Error('Unknown error in fetch response.')
      }
    })
    .then((returnedResponse) => returnedResponse.text())
    .then((text) => {
      const startTime = Date.now();
      let values = getStatebinData(text);
      const msElapsed = Date.now() - startTime;
      console.log(`Statebinning function took ${msElapsed / 1000} seconds to complete.`);
      return values;
    }).catch((error) => {
      console.log(error)
    })
};

const getConditionData = async (qs) => {
  console.log(qs)
  console.log(`http://${host}:${port}/api/bridges/${qs}`)
  return await fetch(`http://${host}:${port}/api/bridges/${qs}`)
    .then((response) => {
      if (response.ok) {
        return response
      } else if (response.status >= 400 && response.status < 600) {
        throw new Error("Bad response from server");
      } else if (typeof response === 'undefined') {
        throw new Error('Response was undefined')
      } else {
        throw new Error('Unknown error in fetch response.')
      }
    })
    .then((returnedResponse) => returnedResponse.json()
   ).catch((error) => {
     console.log(error)
   })
};

export { getCountryData, getStateData, getConditionData };
