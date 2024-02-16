import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountMenu from "./_components/Profile";
import Link from "next/link";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar variant="dense" className="flex justify-between ">
          <Link href="/">
            <Typography variant="h6" color="inherit" component="div">
              ƒ Speech Transfrom AI
            </Typography>
          </Link>
          <AccountMenu />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
