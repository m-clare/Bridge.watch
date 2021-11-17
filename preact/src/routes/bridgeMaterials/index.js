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
import { bridgeMaterials } from "../../components/explanations";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

const html = htm.bind(h);

const useStyles = makeStyles({
  card: {
    maxWidth: 1200,
    boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
    backgroundColor: "#fafafa",
  },
  media: {
    height: 300,
  },
  scaledMedia: {
    height: 300,
    backgroundSize: "contain",
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

export default function BridgeMaterials() {
  const classes = useStyles();

  const [typesExpanded, setTypesExpanded] = useState(
    bridgeMaterials
      .map((bridgeMaterial) => bridgeMaterial.material)
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
      <${Grid} item xs=${12}><${Typography} variant="h2">Bridge Materials</${Typography}></${Grid}>
      ${bridgeMaterials.map(
        (bridgeMaterial, index) =>
          html`
      <${Grid} item xs=${12} sm=${12} key=${index}>
        <${Card} className=${classes.card}>
          <${CardHeader} title=${bridgeMaterial.material} color="primary" />
          ${
            "img" in bridgeMaterial
              ? html` <${CardMedia}
                  className=${classes.media}
                  image=${bridgeMaterial.img}
                />`
              : null
          }
          ${
            "attrLink" in bridgeMaterial
              ? html`<p
                  style=${"padding-left: 5px; margin-top: -20px; margin-bottom: 0px; font-size: 0.8rem; color: #bdbdbd"}>
                  <a href=${bridgeMaterial.attrLink} style=${"color: #bdbdbd"}
                    >Photo</a> by ${bridgeMaterial.attrAuthor} /
                  <a
                    href=${bridgeMaterial.attrLicenseLink}
                    style=${"color: #bdbdbd"}
                    >${bridgeMaterial.attrLicense}</a>
                </p>`
              : null
          }
          <${CardContent}>
            <${Typography} variant="body1" paragraph>${
            bridgeMaterial.shortDescription
          }</${Typography}>
          </${CardContent}>
          ${
            "paragraph1" in bridgeMaterial || "bImg" in bridgeMaterial
              ? html`
          <${CardActions} disableSpacing>
            <${ExpandMore} expand=${typesExpanded[bridgeMaterial.material]}
                           onClick=${(e) =>
                             handleExpandClick(e, bridgeMaterial.material)}
              aria-expanded=${typesExpanded[bridgeMaterial.material]}
              aria-label="show more">
              <${ExpandMoreIcon} />
            </${ExpandMore}>
          </${CardActions}>
          <${Collapse} in=${
                  typesExpanded[bridgeMaterial.material]
                } timeout="auto" unmountOnExit>
            <${CardContent}>
              <${Typography} variant="body1" paragraph>${
                  bridgeMaterial.paragraph1
                }</${Typography}>
              <${Typography} variant="body1" paragraph>${
                  bridgeMaterial.paragraph2
                }</${Typography}>
            </${CardContent}>
            ${
              "bImg" in bridgeMaterial
                ? html`<${CardMedia}
                    className=${classes.scaledMedia}
                    image=${bridgeMaterial.bImg}
                  />`
                : null
            }
            ${
              "bLink" in bridgeMaterial
                ? html` <p style=${"padding-left: 5px; margin-top: -20px; margin-bottom: 0px; font-size: 0.8rem; color: #bdbdbd"}>
              <a href=${bridgeMaterial.bLink} style=${"color: #bdbdbd"}
                 >Photo</a> by ${bridgeMaterial.bAuthor} /
              <a
                href=${bridgeMaterial.bLicenseLink}
                style=${"color: #bdbdbd"}
                >${bridgeMaterial.bLicense}</a>
            </p>`
            : null
            }
          </${Collapse}>`
              : null
          }
        </${Card}>
      </${Grid}>`
      )}
    </${Grid}>
  </${Container}>
</${Box}> 
  `;
}
