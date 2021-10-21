// helpers for express server
import fetch from "node-fetch";
import dotenv from 'dotenv';
import { getHexbinData } from "./hexbin.js";

dotenv.config();

const host = process.env.DATA_HOST
const port = process.env.DATA_PORT

// possible arguments async (state = null) to abvoid multiple functions
const getBridgeData = async (qs) => {
  console.log(`http://${host}:${port}/api/bridges/national${qs}`)
  return await fetch(`http://${host}:${port}/api/bridges/national${qs}`)
    .then((response) => {
      if (response.status >= 400 && response.status < 600) {
        throw new Error("Bad response from server");
      }
      return response
    })
    .then((returnedResponse) => returnedResponse.text())
    .then((text) => {
      let values = getHexbinData(text);
      return values;
    }).catch((error) => {
      console.log(error)
    })
};

export { getBridgeData };
