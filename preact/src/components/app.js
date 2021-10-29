import { h } from "preact";
import { Router } from "preact-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container } from "@mui/material/Container";
import htm from "htm";
const html = htm.bind(h);
import Header from "./header";
import Footer from "./footer";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Profile from "../routes/profile";
import Country from "../routes/country";

const THEME = createTheme({
  typography: {
    "fontFamily": `"Fira Sans", "Helvetica", "Arial", sans-serif`,
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  },
  palette: {
    primary: {
      main: "#1c5d99",
      light: "#588aca",
      dark: "#00346a",
      contrastText: "#ffffff"

    },
    secondary: {
      main: "#c44436",
      light: "#fc7561",
      dark: "#8d090f"
    }
  }

})

const App = () => (
html`
<${ThemeProvider} theme=${THEME}>
  <div id="app">
    <${Header} />
    <${Router}>
      <${Country} path="/" />
      <${Country} path="/country" />
    </${Router}>
    <${Footer} />
  </div>
</${ThemeProvider}>`
);

export default App;
