import { h } from "preact";
import { useState } from "preact/hooks";
import htm from "htm";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Button from "@mui/material/button";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
const html = htm.bind(h);

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return html`<${IconButton} ...${other} />`;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export function CountryDescription({ summaryType, keyValues }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (summaryType === "rating") {
    const field = keyValues.field;
    const count = keyValues.count;
    return html`
    <${Grid} item container>
      <${Card} variant=${"outlined"}>
        <${Grid} item xs=${12}>
          <${CardContent}>
            <${Typography} variant="h5" component="h2">Plot Summary</${Typography}>
            <p>This map aggregates the locations of ${Number(
              Math.round(count / 100) * 100
            ).toLocaleString()} bridges in the U.S. with their overall "rating" as encoded in the <${Link} underline=${"hover"} href="https://www.fhwa.dot.gov/bridge/nbi.cfm"><b> 2020 National Bridge Inventory</b></${Link}> on a scale of 0 to 9. Bridges that are missing ratings are omitted from the plot. The hexagon size represents the number of bridges in the vicinity, while the color represents the most common rating in the corresponding histogram. Additional filtering can be performed using the options above. </p>
          </${CardContent}>
          <${CardActions} disableSpacing>
            <${Button} variant="text" onClick=${handleExpandClick}>More information</${Button}>
            <${ExpandMore}
              expand=${expanded}
              onClick=${handleExpandClick}
              aria-expanded=${expanded}
              aria-label="more information"
              >
              <${ExpandMoreIcon} />
            </${ExpandMore}>
          </${CardActions}>
          <${Collapse} in=${expanded} timeout="auto" unmountOnExit>
            <${CardContent}>
              <${Grid} container spacing=${2}>
                <${Grid} item xs=${12}>
                  <${Typography} variant="h5" component="h3">Rating Guide:</${Typography}>
                </${Grid}>
                <${Grid} item xs=${12} sm=${4}>
                  <${Typography} variant="h6" component="h4">"Poor" Conditions</${Typography}>
                  <ul>
                    <li>0 - Failed Condition (Not In Service)</li>
                    <li>1 - Imminent Failure Condition (Not In Service)</li>
                    <li>2 - Critical Condition</li>
                    <li>3 - Serious Condition</li>
                    <li>4 - Poor Condition</li>
                  </ul>
                </${Grid}>
                <${Grid} item xs=${12} sm=${4}>
                  <${Typography} variant="h6" component="h4">"Fair" Conditions</${Typography}>
                  <ul>
                    <li>5 - Fair Condition</li>
                    <li>6 - Satisfactory Condition</li>
                  </ul>
                </${Grid}>
                <${Grid} item xs=${12} sm=${4}>
                  <${Typography} variant="h6" component="h4">"Good" Conditions</${Typography}>
                  <ul>
                    <li>7 - Good Condition</li>
                    <li>8 - Very Good Condition</li>
                    <li>9 - Excellent Condition</li>
                  </ul>
                </${Grid}>
                <${Grid} item xs=${12}>
                  <p style=${"margin: 0px"}>The lowest rating for a specific bridge component (superstructure, substructure, or deck) determines the overall rating of Good/Fair/Poor.</p>
                  <p>For example, a bridge with:</p>
                  <ul>
                    <li>7 - "Good" - substructure</li>
                    <li>8 - "Very Good" - superstructure</li>
                    <li>8 - "Very Good" - deck</li>
                  </ul>
                  <p>would be assigned a lowest rating of 7 (the value indicated in the plot) and overall assessment of "Good".</p>
                </${Grid}>
              </${Grid}>
            </${CardContent}>
          </${Collapse}>
        </${Grid}>
      </${Card}>
    </${Grid}>`;
  } else if (summaryType === "year built") {
    return;
  } else {
    return;
  }
}
