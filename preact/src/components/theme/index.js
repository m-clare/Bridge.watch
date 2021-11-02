export default {
  typography: {
    "fontFamily": `"Fira Sans", "Helvetica", "Arial", sans-serif`,
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
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
      dark: "#8d090f",
      contrastText: "#ffffff"
    }
  },
  typographyVariant: {
    fontVariant: "small-caps"
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontVariant: "small-caps",
        },
        h2: {
          fontVariant: "small-caps",
        },
        h3: {
          fontVariant: "small-caps",
        },
        h4: {
         fontVariant: "small-caps",
        },
        h5: {
          fontVariant: "small-caps",
        },
        h6: {
          fontVariant: "small-caps",
        }

      }
    }
  }
}
