import { h } from "preact";
import htm from "htm";
import { useState } from "preact/hooks";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import { bridgeTypes } from "../../components/explanations";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

const html = htm.bind(h);

const useStyles = makeStyles({
  card: {
    maxWidth: 600,
    boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
    backgroundColor: "#fafafa",
  },
  media: {
    height: 300,
  },
});

function getArrayAsString(title, array) {
  let stringArray = [];
  return `${title}: ${array.sort().join(", ")}`;
}

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function BridgeTypes() {
  const classes = useStyles();

  const [typesExpanded, setTypesExpanded] = useState(
    bridgeTypes
      .map((bridgeType) => bridgeType.type)
      .reduce((acc, curr) => ((acc[curr] = false), acc), {})
  );

  const handleExpandClick = (event, type) => {
    const idExpanded = !typesExpanded[type];
    setTypesExpanded({ ...typesExpanded, [type]: idExpanded });
  };

  return html`
<${Box} sx=${{ padding: "24px" }}>
  <${Container} maxWidth="lg">
    <${Grid} container spacing=${3}>
      <${Grid} item xs=${12}><${Typography} variant="h2">Types of Bridges</${Typography}></${Grid}>
      ${bridgeTypes.map(
        (bridgeType, index) =>
          html`
      <${Grid} item xs=${12} sm=${6} key=${index}>
        <${Card} className=${classes.card}>
          <${CardHeader} title=${
            bridgeType.type
          } color="primary" subheader=${getArrayAsString(
            "Typical materials",
            bridgeType.materialOptions
          )}/>
          ${
            "img" in bridgeType
              ? html` <${CardMedia}
                  className=${classes.media}
                  image=${bridgeType.img}
                />`
              : null
          }
          ${
            "attrLink" in bridgeType
              ? html`
          <p style=${"padding-left: 5px; margin-top: -20px; margin-bottom: 0px; font-size: 0.8rem; color: #bdbdbd"}
             >
            <a href=${bridgeType.attrLink} style=${"color: #bdbdbd"}
               >Photo</a> by ${bridgeType.attrAuthor} /
            <a
              href=${bridgeType.attrLicenseLink}
              style=${"color: #bdbdbd"}
              >${bridgeType.attrLicense}</a>
          </p>`
          : null
          }
          <${CardContent}>
            <${Typography} color="primary" variant="h6">${
            bridgeType.exampleName
          }</${Typography}>
            <${Typography} color="textSecondary" variant="subtitle1">${
            bridgeType.exampleLocation
          }</${Typography}>
            <${Typography} color="textSecondary" variant="subtitle1">${
            bridgeType.exampleStructuralEngineer
          }</${Typography}>
          </${CardContent}>
          <${CardActions} disableSpacing>
            <${ExpandMore} expand=${typesExpanded[bridgeType.type]}
                           onClick=${(e) =>
                             handleExpandClick(e, bridgeType.type)}
              aria-expanded=${typesExpanded[bridgeType.type]}
              aria-label="show more"
              >
              <${ExpandMoreIcon} />
            </${ExpandMore}>
          </${CardActions}>
          <${Collapse} in=${
            typesExpanded[bridgeType.type]
          } timeout="auto" unmountOnExit>
            <${CardContent}>
              <${Typography} paragraph>${bridgeType.description}</${Typography}>
            </${CardContent}>
            ${('constructionImg' in bridgeType) ? (html`<${CardMedia} className=${classes.media} image=${bridgeType.constructionImg}/>`) : null}
            ${
            "cImgAttrLink" in bridgeType
              ? html`
          <p style=${"padding-left: 5px; margin-top: -20px; margin-bottom: 0px; font-size: 0.8rem; color: #bdbdbd"}
             >
            <a href=${bridgeType.cImgAttrLink} style=${"color: #bdbdbd"}
               >Photo</a> by ${bridgeType.cImgAttrAuthor} /
            <a
              href=${bridgeType.cImgAttrLicenseLink}
              style=${"color: #bdbdbd"}
              >${bridgeType.cImgAttrLicense}</a>
          </p>`
          : null
          }
          </${Collapse}>
        </${Card}>
      </${Grid}>`
      )}
    </${Grid}>
  </${Container}>
</${Box}> 
  `;
}
