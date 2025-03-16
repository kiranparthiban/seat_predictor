// src/pages/Result.jsx
import React from "react";
import { Box, Button, Typography, Link } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state; // Data passed from Home.jsx

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h5">
        The chance of getting admission in Madras Christian College is
      </Typography>

      <Typography variant="h3" sx={{ mt: 2 }}>
        {resultData ? resultData.seat_selection_probability + "%" : "No result available."}
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Thank you
      </Typography>

      <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/home")}>
        Go Back
      </Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Visit:{" "}
        <Link href="https://mcc.edu.in/admission/" target="_blank" rel="noopener noreferrer">
          https://mcc.edu.in/admission/
        </Link>
      </Typography>
    </Box>
  );
}

export default Result;
