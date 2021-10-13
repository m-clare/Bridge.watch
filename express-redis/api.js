// helpers for express server
import fetch from "node-fetch";
import { DATA_SERVICE_URL } from "./config.js";
import { getHexbinData } from "./hexbin.js";
// const hexbin = require('./hexbin')

// possible arguments async (state = null) to abvoid multiple functions
const getBridgeData = async () => {
  return await fetch(`${DATA_SERVICE_URL}/national?plot_type=rating`)
    .then((response) => response.json())
    .then((json) => {
      let values = getHexbinData(json);
      return values;
    });
};

export { getBridgeData };
