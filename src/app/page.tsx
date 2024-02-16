import * as React from "react";
import "./globals.css";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import HomeComponent from "./components/Home";

export default function App() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            marginTop: "50px",
          }}
        >
          {/* <Toolbar /> */}
          <HomeComponent />
        </Box>
      </Box>
    </>
  );
}
