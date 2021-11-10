import { h } from "preact";
import { useState } from "preact/hooks";
import htm from "htm";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "preact-router/match";

const html = htm.bind(h);

export default function TopMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (html`
      <${Button} sx=${{px: 2}}
        color="inherit"
        id="background-info-button"
        aria-controls="background-info-menu"
        aria-haspopup="true"
        aria-expanded=${open ? 'true' : undefined}
        onClick=${handleClick}
      >
        Background
      </${Button}>
      <${Menu} 
        id="background-info-menu"
        anchorEl=${anchorEl}
        open=${open}
        onClose=${handleClose}
        MenuListProps=${{
          'aria-labelledby': 'background-info-button',
        }}
      >
        <${MenuItem} onClick=${handleClose}>
          <${RouterLink} href='/bridge_types'
                         style=${"color: #1c5d99; text-decoration: none; font-variant: small-caps"}>
            Bridge Types
          </${RouterLink}>
        </${MenuItem}>
      </${Menu}>
`)
}
