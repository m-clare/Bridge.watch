import { h } from "preact";
import htm from "htm";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { multiFilter, yearRangeFilter, numberRangeFilter } from "../formComponents";
import { handleDetailedSubmitClick, handleDetailedClearClick } from "../helperFunctions";
;
const html = htm.bind(h);

export function DetailedForm({
  stateInfo,
  colWidth
}) {
  const topPadding = (parseInt(colWidth) === 12) ? "padding-top: 0px" : "padding-top: 24px"
  console.log(topPadding)
  console.log(typeof(topPadding))
  return html`
  <${Grid} item xs=${12}>
  <${Typography} variant="h6"
                 component="h2"
                 color="${grey[500]}">
    <i>Detailed Filters</i>
  </${Typography}>
</${Grid}>
<${Grid} item container spacing=${3} xs=${12}>
  <${Grid} item xs=${12} md=${colWidth} sx=${{paddingTop: topPadding}}>
  <${Typography} variant="caption"
                 component="h2"
                 color="${grey[500]}">
    <i>Rating</i>
  </${Typography}>
  </${Grid}>
</${Grid}>
<${Grid} item container spacing=${3} xs=${12}>
<${Grid} item xs=${12} md=${colWidth}  sx=${{paddingTop: topPadding}}>
  <${Typography} variant="caption"
                 component="h2"
                 color="${grey[500]}">
    <i>Year Built</i>
  </${Typography}>
${yearRangeFilter(stateInfo)}
</${Grid}>
<${Grid} item xs=${12} md=${colWidth} style=${topPadding}>
  <${Typography} variant="caption"
                 component="h2"
                 color="${grey[500]}">
    <i>Traffic</i>
  </${Typography}>
${numberRangeFilter(stateInfo, "traffic")}
</${Grid}>
<${Grid} item xs=${12} md=${colWidth} style=${topPadding}>
  <${Typography} variant="caption"
                 component="h2"
                 color="${grey[500]}">
    <i>Overall Bridge Length</i>
  </${Typography}>
${numberRangeFilter(stateInfo, "bridge_length")}
</${Grid}>
<${Grid} item xs=${12} md=${colWidth} style=${topPadding}>
  <${Typography} variant="caption"
                 component="h2"
                 color="${grey[500]}">
    <i>Maximum Span Length</i>
  </${Typography}>
${numberRangeFilter(stateInfo, "span_length")}
</${Grid}>
</${Grid}>
<${Grid} item container spacing=${3} xs=${12}>
<${Grid} item xs=${12} md=${colWidth}>
  <${Button} fullWidth disabled=${stateInfo.submitted} variant="contained" color="primary" onClick=${(e) => handleDetailedSubmitClick(e, stateInfo)}>Submit detailed query</${Button}>
</${Grid}>
<${Grid} item xs=${12} md=${colWidth}>
  <${Button} fullWidth disabled=${stateInfo.submitted} variant="contained" color="primary" onClick=${(e) => handleDetailedClearClick(e, stateInfo)}>Clear detailed filters</${Button}>
</${Grid}>
</${Grid}>
  `
}
