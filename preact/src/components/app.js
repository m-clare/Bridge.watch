import { h } from "preact";
import { Router } from "preact-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import htm from "htm";
const html = htm.bind(h);
import Header from "./header";
import Footer from "./footer";
import { makeStyles } from "@mui/styles";
import theme from "./theme";
// Code-splitting is automated for `routes` directory
import CountryBridges from "../routes/country";
import StateBridges from "../routes/state";
import ConditionBridges from "../routes/condition";
import About from "../routes/about";
import BridgeTypes from "../routes/bridgeTypes";
import BridgeMaterials from "../routes/bridgeMaterials";
import HeadToHead from "../routes/headToHead";
import BlogPost from "../routes/posts";

import useScrollTrigger from "@mui/material/useScrollTrigger";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Zoom from "@mui/material/Zoom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
const THEME = createTheme(theme);

function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return html`
      <${Zoom} in=${trigger}>
      <${Box}
    onClick=${handleClick}
    role="presentation"
    sx=${{ position: "fixed", bottom: 16, right: 16 }}
      >
      ${children}
    </${Box}>
      </${Zoom}>`;
}

const App = () =>
  html`
<${ThemeProvider} theme=${THEME}>
  <div id="app">
    <${Header} />
    <div style=${{ position: "relative", minHeight: "100vh" }}>
    <${Router}>
      <${CountryBridges} path="/" />
      <${About} path="/about" />
      <${BridgeTypes} path="/bridge_types" />
      <${BridgeMaterials} path="/bridge_materials" />
      <${BlogPost} path="/posts/west_seattle_bridge" />
      <${CountryBridges} path="/country" />
      <${StateBridges} path="/state" />
      <${HeadToHead} path="/state_comparison" />
      <${ConditionBridges} path="/condition" />
      <${About} path="/about" />
    </${Router}>
     <${ScrollTop} {...props}>
        <${Fab} color="secondary" size="small" aria-label="scroll back to top">
          <${KeyboardArrowUpIcon} />
        </${Fab}>
      </${ScrollTop}>
    </div>
    <div style=${"bottom: 0; left: 0; right; 0"}>
    <${Footer} />
    </div>
  </div>
</${ThemeProvider}>`;

export default App;
