import { h } from "preact";
import { useState } from "preact/hooks";
import htm from "htm";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import { grey } from "@mui/material/colors";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
const html = htm.bind(h);

const useStyles = makeStyles({
  typographyVariant: {
    fontVariant: "small-caps",
  },
  typographyEmphasis: {
    fontStyle: "italic",
    fontWeight: 300,
  }
});

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

const textSummary = function (summaryType, count) {
  if (summaryType === "rating") {
    return html`
            <p>This map aggregates the locations of ${count} bridges in the U.S. with their overall "rating" based on the lowest value of superstructure, substructure, and deck condition as encoded in the <${Link} underline=${"hover"} href="https://www.fhwa.dot.gov/bridge/nbi.cfm"><b> 2020 National Bridge Inventory</b></${Link}> on a scale of 0 to 9. Bridges that are missing ratings are omitted from the plot. If "scaled hex area" is toggled, the hexagon size represents the number of bridges in the vicinity, while the color represents the median rating in the corresponding histogram. Additional filtering can be performed using the options above. </p>`;
  } else if (summaryType === "year_built") {
    return html`
            <p>This map aggregates the locations of ${count} bridges in the U.S. with their year built as encoded in the <${Link} underline=${"hover"} href="https://www.fhwa.dot.gov/bridge/nbi.cfm"><b> 2020 National Bridge Inventory</b></${Link}>. If "scaled hex area" is toggled, the hexagon size represents the number of bridges in the vicinity, while the color represents the median year built in the corresponding histogram. Additional filtering can be performed using the options above. </p>`;
  } else if (summaryType === "percent_poor") {
    return html`
            <p>This map aggregates the locations of ${count} bridges in the U.S. with the percent of poorly rated bridges within a given hexbin as encoded in the <${Link} underline=${"hover"} href="https://www.fhwa.dot.gov/bridge/nbi.cfm"><b> 2020 National Bridge Inventory</b></${Link}>. Poorly rated bridges have a numerical rating of 4 or lower. Bridges that are missing ratings are omitted from the plot. If "scaled hex area" is toggled, the hexagon size represents the number of bridges in the vicinity, while the color represents percentage of poorly rated bridges. Additional filtering can be performed using the options above. </p>`;
  } else return html`<div></div>`;
};

const textMoreInfo = function (summaryType) {
  if (summaryType === "rating" || "percent_poor") {
    return html`
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
                  <p>would be assigned a lowest rating of 7 and overall assessment of "Good" condition.</p>
                </${Grid}>
              </${Grid}>
            </${CardContent}>
`;
  }
};

const moreInfo = ["rating", "percent_poor"];

const summaryTitle = {
  percent_poor: "Percentage of Bridges in Poor Condition",
  rating: "Lowest Component Rating",
  year_built: "Year Built",
};

function getFiltersAsString(filters) {
  let filterStringArray = [];
  for (const prop in filters) {
    if (filters[prop].length !== 0) {
      const propCapped = prop
        .split(" ")
        .map((word) => {
          return word[0].toUpperCase() + word.substring(1);
        })
        .join(" ");
      filterStringArray.push(`${propCapped}: ${filters[prop].join(" or ")}`);
    }
  }
  return filterStringArray;
}

export function CountryDescription({ summaryType, keyValues }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const field = keyValues.field;
  const count = keyValues.count;
  const { plot_type, ...filters } = keyValues.filters;
  const hasMoreInfo = moreInfo.includes(field);
  const fieldCapped = field
    .split("_")
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");

  return html`
    <${Grid} item container>
      <${Card} variant=${"outlined"}>
        <${Grid} item xs=${12}>
          <${CardContent}>
            <${Typography} className=${classes.typographyVariant}
                           variant="h4"
                           component="h2">${
              summaryTitle[field]
              }</${Typography}>
            ${getFiltersAsString(filters).map(
            (d) =>
            html`<${Typography} className=${classes.typographyEmphasis}
                                variant="h6"
                                component="h3"
                                style=${"font-weight:400, text-variant: small-caps"}>
              ${d}</${Typography}>`
            )}
            ${textSummary(summaryType, count)}
          </${CardContent}>
          ${
          hasMoreInfo
          ? html`<${CardActions} disableSpacing>
            <${Button} variant="text" onClick=${handleExpandClick} fullWidth>More information</${Button}>
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
            ${textMoreInfo(summaryType)}
          </${Collapse}>`
          : null
          }
        </${Grid}>
      </${Card}>
    </${Grid}>`;
    }
    
