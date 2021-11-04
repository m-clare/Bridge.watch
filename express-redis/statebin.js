import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { object } from "underscore";
import { countBy } from "lodash-es";
import { groupBy } from "underscore";


function getStatebinData(data) {
  let startTime = Date.now();
  const [columns, ...parsedData] = d3.csvParse(data);
  let msElapsed = Date.now() - startTime;
  console.log(`csvParse took ${msElapsed / 1000} seconds to complete.`);

  if (parsedData.length !== 0) {
    // get objects by fips code
    const infoByCounty = groupBy(parsedData, "fips_code")
    const countyCount = Object.keys(infoByCounty).map((d) => {
      return {[d.padStart(5, '0')] : infoByCounty[d].length}
    })
    console.log(countyCount)
    // return infoByCounty;
    return
  } else {
    return { message: "No bridges found for your query!" };
  }
}

export { getStatebinData };
