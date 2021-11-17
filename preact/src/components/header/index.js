import { h, Component } from "preact";
import { forwardRef } from "preact/compat";
import { useMemo } from "preact/hooks";
import htm from "htm";
import { Link as RouterLink } from "preact-router/match";
import { Link as MaterialLink } from "@mui/material/Link"
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import TopMenu from "../topMenu";
import SideMenu from "../sideMenu";
import Grid from "@mui/material/Grid";
import masthead from "../../assets/masthead.webp";
import background from "../../assets/blue_wallpaper.webp";

const html = htm.bind(h);

export default function Header() {

  return html`
<${Box} sx=${{ flexGrow: 1 }}>
  <${AppBar} position="relative" sx=${{backgroundImage: `url(${background})`, backgroundSize: "150px auto"}}>
  <${Container} maxWidth="lg">
    <${Toolbar} disableGutters id="back-to-top-anchor">
      <${SideMenu} />
      <${Box} sx=${{ flexGrow: 1}} >
        <${Container} maxWidth="lg"  sx=${{backgroundImage:`url(${masthead})`, backgroundSize: "auto 100px", backgroundRepeat: "no-repeat", height: "100px"}} />
      </${Box}>
      <${Box} sx=${{display: {xs: "none", lg: "inline"}}}>
          <${Button} sx=${{px: 2}}  color="inherit"><${RouterLink} href='/country'
                                                                   style=${"color: #fff; text-decoration: none; text-shadow: #000 1px 0 10px; font-size: 18px"}>
              U.S. Overview</${RouterLink}>
          </${Button}>
          <${Button} sx=${{px: 2}} color="inherit"><${RouterLink} href='/state'
                                                                  style=${"color: #fff; text-decoration: none; text-shadow: #000 1px 0 10px; font-size: 18px"}>
              State Info</${RouterLink}>
          </${Button}>
          <${Button} sx=${{px: 2}} color="inherit"><${RouterLink} href='/condition'
                                                                  style=${"color: #fff; text-decoration: none; text-shadow: #000 1px 0 10px; font-size: 18px"}>
              Condition Info</${RouterLink}>
          </${Button}>
          <${Button} sx=${{px: 2}} color="inherit"><${RouterLink} href='/state_comparison'
                                                                  style=${"color: #fff; text-decoration: none; text-shadow: #000 1px 0 10px; font-size: 18px"}>
              State Comparison</${RouterLink}>
          </${Button}>
          <${TopMenu}/>
          <${Button} sx=${{px: 2}} color="inherit"><${RouterLink} href='/about'
                                                                  style=${"color: #fff; text-decoration: none; text-shadow: #000 1px 0 10px; font-size: 18px"}>
              About</${RouterLink}>
          </${Button}>
      </${Box}>
    </${Toolbar}>
  </${Container}>
  </${AppBar}>
</${Box}>`;
}
