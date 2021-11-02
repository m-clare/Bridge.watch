import { h } from "preact";
import htm from "htm";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const html = htm.bind(h);

export default function About() {
  return html`
<${Box} sx=${{ padding: "16px"}}>
<${Container} maxWidth="lg">
<${Grid} container spacing=${2}>
<${Grid} item xs=${12}>
<${Paper} sx=${{padding: "16px"}} variant=${"outlined"}>
<${Grid} container spacing=${3}>
<${Grid} item xs=${12}>
<${Typography} variant="h3" component="h1">About</${Typography}>
</${Grid}>
<${Grid} item xs=${12}>
<${Typography} variant="h4" component="h1">Acknowledgements</${Typography}>
</${Grid}>
<${Grid} item xs=${12}>
<${Typography} variant="h4" component="h1">Disclaimer</${Typography}>
</${Grid}>
</${Grid}>
</${Paper}>
</${Grid}>
</${Grid}>
</${Container}>
</${Box}>
  `;
}
