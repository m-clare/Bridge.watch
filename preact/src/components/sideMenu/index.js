import { h } from "preact";
import { useState } from "preact/hooks";
import htm from "htm";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Link as RouterLink } from "preact-router/match";
import { makeStyles } from "@mui/styles";

const html = htm.bind(h);

const routes = [
  { key: "U.S. Overview", value: "/country" },
  { key: "State Info", value: "/state" },
  { key: "Condition Info", value: "/condition" },
  { key: "State Comparison", value: "/state_comparison" },
];

const backgroundRoutes = [
  { key: "Bridge Types", value: "/bridge_types" },
  { key: "Bridge Materials", value: "/bridge_materials" },
];

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "black",
    fontVariant: "small-caps",
  },
});

export default function SideMenu() {
  const [state, setState] = useState(false);
  const classes = useStyles();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
  };

  return html`
<${Box} sx=${{ display: { xs: "inline", lg: "none" } }}>
  <${IconButton} size="medium"
                 edge="start"
                 color="inherit"
                 aria-label="menu"
                 sx=${{ mr: 2 }}
                 onClick=${toggleDrawer(true)}
                 >
    <${Drawer} open=${state}
               onClose=${toggleDrawer(false)}
               >
      <${Box} sx=${{ width: 250 }}
              role="presentation"
              onClick=${toggleDrawer(false)}
              onKeyDown=${toggleDrawer(false)}
              >
        <${List}>
          ${routes.map(
          (route) =>
          html`<${RouterLink} className=${classes.link}
                              activeClassName="active"
                              href=${route.value}>
            <${ListItem} button key=${route.key}
                         onClick=${toggleDrawer(false)}>
              <${ListItemText} primary=${route.key} />
            </${ListItem}>
          </${RouterLink}>`
          )}
          <${ListItem}>
            <${ListItemText} sx=${{
                             fontVariant: "small-caps",
                             }} primary="Background Information"/>
          </${ListItem}>
          ${backgroundRoutes.map(
          (route) =>
          html`<${RouterLink} className=${classes.link}
                              activeClassName="active"
                              href=${route.value}>
            <${ListItem} button key=${route.key}
                         onClick=${toggleDrawer(false)}
                         sx=${{ pl: 4 }}>
              <${ListItemText} primary=${route.key} />
            </${ListItem}>
          </${RouterLink}>`
          )}
          <${RouterLink} className=${
                         classes.link
                         } activeClassName="active" href="/about">
            <${ListItem} button key=${"About"}
                      onClick=${toggleDrawer(false)}>
              <${ListItemText} primary="About"/></${ListItem}>
          </${RouterLink}>
        </${List}>
      </${Box}>
    </${Drawer}>
    <${MenuIcon} />
  </${IconButton}>
</${Box}>
`;
}
