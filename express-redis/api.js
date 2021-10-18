
// helpers for express server
import fetch from "node-fetch";
import dotenv from 'dotenv';
import { getHexbinData } from "./hexbin.js";

dotenv.config();

const host = process.env.DATA_HOST
const port = process.env.DATA_PORT

// possible arguments async (state = null) to abvoid multiple functions
const getBridgeData = async (qs) => {
  return await fetch(`http://${host}:${port}/api/bridges/national${qs}`)
    .then((response) => response.text())
    .then((text) => {
      let values = getHexbinData(text);
      return values;
    });
};

export { getBridgeData };
