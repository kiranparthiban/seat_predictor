// src/pages/Login.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

/**
 * A brand-new Login component.
 * It sends { username, password } in JSON format
 * to http://127.0.0.1:8000/auth/login/
 */
function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform a POST request with JSON body
      const response = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
        credentials: "include", // If using session cookies in Django
      });

      const data = await response.json();

      if (response.ok) {
        // Success: we can redirect to home
        alert(data.message || "Login successful!");
        navigate("/");
      } else {
        // Failure: possibly 401 or 400
        alert(`Error: ${data.error || "Login failed"}`);
      }
    } catch (error) {
      // Network or parse error
      console.error(error);
      alert("An error occurred during login.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" textAlign="center">
        Login
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        {/* Password */}
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          type="password"
          required
        />

        {/* Submit Button */}
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>

      {/* Don't have an account? */}
      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <Link component={RouterLink} to="/register">
          Register
        </Link>
      </Typography>
    </Box>
  );
}

export default Login;
