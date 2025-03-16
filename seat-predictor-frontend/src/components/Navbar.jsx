// src/components/Navbar.jsx
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: "space-between" }}>
        {/* Left Side: Placeholder Logo */}
        <Box display="flex" alignItems="center">
          <img
            src="/mcc_logo.jpg"  /* or from /src/assets if you prefer */
            alt="MCC Logo"
            style={{ width: "50px", marginRight: "8px" }}
          />
          <Typography variant="h6">MCC Seat Predictor</Typography>
        </Box>

        {/* Right Side: Links */}
        


        <Box>
        <Button color="inherit" component={Link} to="/">
  Home
</Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/result">
            Result
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
