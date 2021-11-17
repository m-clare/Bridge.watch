import { h } from "preact";
import htm from "htm";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link"

const html = htm.bind(h);

export default function About() {
  return html`
<${Box} sx=${{ padding: 3}}>
<${Container} maxWidth="lg">
<${Grid} container spacing=${3}>
<${Grid} item xs=${12}>
<${Paper} sx=${{padding: 4}}>
<${Grid} container spacing=${3}>
<${Grid} item xs=${12}>
<${Typography} variant="h4" component="h1" gutterBottom>About</${Typography}>
<${Typography} variant="body1" paragraph>Bridge.watch is an interactive data visualization tool for exploring information about bridges in the U.S. based on the <${Link} href="https://www.fhwa.dot.gov/bridge/nbi.cfm" underline="hover"><b>National Bridge Inventory 2021</b></${Link}>. This dataset includes a wealth of information surrounding the attributes of bridges in the U.S. as well as their condition and upkeep. If you're interested in other attributes of the data or want to know more about this project, feel free to <${Link} href="mailto:m.wachter@utsv.net" underline="hover"><b>contact me</b></${Link}>. Additional details on the design of this site can be found in this <${Link} href="https://mclare.blog/posts/building-bridge-watch" underline="hover"><b>blog post</b></${Link}>. If you like my work and this project, you can support me on <${Link} href="https://ko-fi.com/mclare" underline="hover"><b>Ko-fi</b></${Link}>.</${Typography}>
<${Typography} variant="h4" component="h1" gutterBottom>About the developer</${Typography}>
<${Typography} variant="body1" paragraph>As a software developer and structural engineer, I like building useful tools. After starting my career in bridge design, I've since worked on the design of several landmark structures before concentrating on software development. While I've spent much of my career focusing on the details of how a structure gets put together, I also like to tackle larger problems surrounding the built environment and making the work of structural engineers more visible to the public.</${Typography}>
<${Typography} variant="h4" component="h1" gutterBottom>Acknowledgements</${Typography}>
<${Typography} variant="body1" gutterBottom paragraph>I developed this project during my recent batch at the <${Link} href="https://www.recurse.com" underline="hover"><b>Recurse Center</b></${Link}>. I can't thank this organization enough for providing the space and resources for me to become a better programmer and connecting me to a supportive community. In particular I'd like to thank Ryan Prior and Shae Erisson for being so generous with their time and expertise. Thanks to Patrick Mineault, Kracekumar, and Jim Kang for their help/pairing on various issues, and thanks to Ksenia Tretiakova and Diederik Vienendaal for their design feedback.</${Typography}>
<${Typography} variant="body1" paragraph>
Most of all, thank you to my wonderful husband, Aaron Freidenberg, who has always been supportive of my programming endeavors and encouraged me to go all in on software development. He's also responsible for much of the supporting text throughout the project.</${Typography}>
<${Typography} variant="body1" paragraph>
Border graphics and logo were created by <${Link} href="https://twitter.com/markhipwell1990/" underline="hover"><b>Mark Hipwell</b></${Link}>, a fellow bridge enthusiast.
</${Typography}>
<${Typography} variant="body1" paragraph>
D3 visualizations are derived from the work of <${Link} href="https://observablehq.com/@mbostock" underline="hover"><b>Mike Bostock</b></${Link}> over on <${Link} href="https://observablehq.com/@d3/charts" underline="hover"><b>Observable</b></${Link}>.
</${Typography}>
<${Typography} variant="h4" component="h1" gutterBottom>Disclaimer</${Typography}>
<${Typography} variant="body1" gutterBottom>
UTSV and Maryanne Wachter assume no responsibility or liability for any errors or omissions in the content of this site. All information is provided on an "as is" basis with no guarantee of completeness, accuracy, usefulness, or of the results obtained from the use of this information.
</${Typography}>
</${Grid}>
</${Grid}>
</${Paper}>
</${Grid}>
</${Grid}>
</${Container}>
</${Box}>
  `;
}
