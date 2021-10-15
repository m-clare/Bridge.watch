import { h } from "preact";
import htm from "htm";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";

const html = htm.bind(h);

export default function filterForm() {
  return html`
  <${FormControl} sx={{m: 1 , minWidth: 120}}></${FormControl}>
  `

}
