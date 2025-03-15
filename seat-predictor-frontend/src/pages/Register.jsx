// src/pages/Register.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

/**
 * A brand-new Register component.
 * It sends { username, email, phone_number, password }
 * in JSON format to http://127.0.0.1:8000/auth/register/
 */
function Register() {
  const navigate = useNavigate();

  // Local state for form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform a POST request with JSON body
      const response = await fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          phone_number: phoneNumber, // EXACT match with Django's "phone_number"
          password,                  // EXACT match with Django's "password"
        }),
        // Allows sending & receiving cookies if you use Django sessions
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // Success case
        alert(data.message || "Registration successful!");
        // Navigate to home ("/") or "/login", your choice
        navigate("/login");
      } else {
        // Error case
        alert(`Error: ${data.error || "Registration failed"}`);
      }
    } catch (error) {
      // Network or parsing error
      console.error(error);
      alert("An error occurred during registration.");
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
        Register
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

        {/* Email */}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          type="email"
          required
        />

        {/* Phone Number */}
        <TextField
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
          Register
        </Button>
      </form>

      {/* Already have an account? */}
      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/login">
          Login
        </Link>
      </Typography>
    </Box>
  );
}

export default Register;
