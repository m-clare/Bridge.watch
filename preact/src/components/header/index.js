import { h, Component } from "preact";
import htm from "htm";
import { Link } from "preact-router/match";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const html = htm.bind(h);

export default function Header() {
  return html`
<${Box} sx=${{ flexGrow: 1 }}>
  <${AppBar} position="static">
    <${Toolbar}>
    </${Toolbar}>
  </${AppBar}>
</${Box}>`;
}
