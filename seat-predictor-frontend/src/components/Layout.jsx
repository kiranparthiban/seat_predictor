// src/components/Layout.jsx
import React from "react";
import { Box } from "@mui/material";

function Layout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/bgmcc.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </Box>
  );
}

export default Layout;
