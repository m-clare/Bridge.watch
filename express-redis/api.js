// helpers for express server
import fetch from "node-fetch";
import { getHexbinData } from "./hexbin.js";

const host = process.env.DATA_HOST
const port = process.env.DATA_PORT

// possible arguments async (state = null) to abvoid multiple functions
const getBridgeData = async () => {
  return await fetch(`http://${host}:${port}/api/bridges/n2?plot_type=rating`)
    .then((response) => response.text())
    .then((text) => {
      let values = getHexbinData(text);
      return values;
    });
};

export { getBridgeData };
