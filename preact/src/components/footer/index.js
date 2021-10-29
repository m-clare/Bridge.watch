import { h, Component } from "preact";
import htm from "htm";
import { Link } from "preact-router/match";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid"
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider"
import Container from "@mui/material/Container"

const html = htm.bind(h);

export default function Footer() {
  return html`
<${Box} sx=${{ flexGrow: 1, backgroundColor: 'primary.main', padding: "16px"}}>
<${Container} maxWidth="lg">
<${Grid} container style=${"padding: 16px"} spacing=${3}>
<${Grid} item xs=${12} sm=${4}>
<${Typography} variant="h6" color="common.white">Bridge.watch</${Typography}>
<p style=${"color: #ffffff"}>Bridge.watch provides interactive data visualization for open access data records of bridges located in the United States.</p>
</${Grid}>
<${Grid} item xs=${12} sm=${4}>
</${Grid}>
<${Grid} item xs=${12} sm=${4}>
</${Grid}>
</${Grid}>
<${Divider} variant="middle" light />
</${Container}>
</${Box}>
`
}
