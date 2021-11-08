import { h, Component } from "preact";
import { forwardRef } from "preact/compat";
import { useMemo } from "preact/hooks";
import htm from "htm";
import { Link as RouterLink } from "preact-router/match";
import { Link as MaterialLink } from "@mui/material/Link"
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import TopMenu from "../topMenu";

const html = htm.bind(h);

export default function Header() {

  return html`
<${Box} sx=${{ flexGrow: 1 }}>
  <${AppBar} position="static">
    <${Toolbar}>
      <${Typography} variant="h6" component="div" sx=${{ flexGrow: 1 }}>
      Bridge.watch
      </${Typography}>
      <${Box} sx=${{display: {xs: "none", md: "inline"}}}>
      <${Button} color="inherit"><${RouterLink} href='/country'
                                                style=${"color: #fff; text-decoration: none"}>
          Country</${RouterLink}>
      </${Button}>
      <${Button} color="inherit"><${RouterLink} href='/state'
                                                style=${"color: #fff; text-decoration: none"}>
          State</${RouterLink}>
      </${Button}>
      <${TopMenu} />
      </${Box}>
    </${Toolbar}>
  </${AppBar}>
</${Box}>`;
}
