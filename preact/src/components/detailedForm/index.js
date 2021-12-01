import { h } from "preact";
import htm from "htm";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { multiFilter, yearRangeFilter, numberRangeFilter } from "../formComponents";
import { multiFilters } from "../options";

const html = htm.bind(h);

export function DetailedForm({
  detailedQueryState,
  handleRangeChange,
  handleSubmitClick,
  handleClearClick,
  validRanges,
  submitted
}) {
  return html`
<${Grid} item xs=${12}>
  <${Typography} variant="h6"
                 component="h2"
                 color="${grey[500]}">
    <i>Detailed Filters</i>
  </${Typography}>
</${Grid}>
<${Grid} item container spacing=${3} xs=${12}>
  <${Grid} item xs=${12} md=${3}>
  <${Typography} variant="caption"
                 component="h2"
                 color="${grey[500]}">
    <i>Rating</i>
  </${Typography}>
  </${Grid}>
</${Grid}>
<${Grid} item container spacing=${3} xs=${12}>
<${Grid} item xs=${12} md=${3}>
  <${Typography} variant="caption"
                 component="h2"
                 color="${grey[500]}">
    <i>Year Built</i>
  </${Typography}>
<${yearRangeFilter} detailedQueryState=${detailedQueryState}
                    handleRangeChange=${handleRangeChange}
                    validRange=${validRanges.year_built}
                    submitted=${submitted} />
</${Grid}>
<${Grid} item xs=${12} md=${3}>
  <${Typography} variant="caption"
                 component="h2"
                 color="${grey[500]}">
    <i>Traffic</i>
  </${Typography}>
<${numberRangeFilter} detailedQueryState=${detailedQueryState}
                      field="traffic"
                      handleRangeChange=${handleRangeChange}
                      validRange=${validRanges.traffic}
                      submitted=${submitted} />
</${Grid}>
<${Grid} item xs=${12} md=${3}>
  <${Typography} variant="caption"
                 component="h2"
                 color="${grey[500]}">
    <i>Overall Bridge Length</i>
  </${Typography}>
<${numberRangeFilter} detailedQueryState=${detailedQueryState}
                      field="bridge_length"
                      handleRangeChange=${handleRangeChange}
                      validRange=${validRanges.bridge_length}
                      submitted=${submitted} />
</${Grid}>
<${Grid} item xs=${12} md=${3}>
  <${Typography} variant="caption"
                 component="h2"
                 color="${grey[500]}">
    <i>Maximum Span Length</i>
  </${Typography}>
<${numberRangeFilter} detailedQueryState=${detailedQueryState}
                      field="span_length"
                      handleRangeChange=${handleRangeChange}
                      validRange=${validRanges.span_length}
                      submitted=${submitted} />
</${Grid}>
</${Grid}>
<${Grid} item container spacing=${3} xs=${12}>
<${Grid} item xs=${12} md=${3}>
  <${Button} fullWidth disabled=${submitted} variant="contained" color="primary" onClick=${handleSubmitClick}>Submit detailed query</${Button}>
</${Grid}>
<${Grid} item xs=${12} md=${3}>
  <${Button} fullWidth disabled=${submitted} variant="contained" color="primary" onClick=${handleClearClick}>Clear detailed filters</${Button}>
</${Grid}>
</${Grid}>
`
}
