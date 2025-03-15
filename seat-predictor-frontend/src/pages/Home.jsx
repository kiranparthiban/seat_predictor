// src/pages/Home.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";

function Home() {
  // State for each form field
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [religion, setReligion] = useState("");
  const [course, setCourse] = useState("");
  const [stream, setStream] = useState("");
  const [degree, setDegree] = useState("");
  const [category, setCategory] = useState("");
  const [class12Percentage, setClass12Percentage] = useState("");

  // State to display result
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data as JSON
      const response = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          date_of_birth: dateOfBirth,
          mobile_number: mobileNumber,
          gender,
          email,
          religion,
          course,
          stream,
          degree,
          category,
          class_12_percentage: class12Percentage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show the entire response or just seat_selection_probability
        setResult(data);
      } else {
        // If there's an error from the backend
        alert(data.error || "Error occurred while predicting.");
      }
    } catch (error) {
      console.error("Predict error:", error);
      alert("Failed to connect to the prediction endpoint.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center">
        Seat Prediction
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        {/* Date of Birth (YYYY-MM-DD or any format you prefer) */}
        <TextField
          label="Date of Birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="YYYY-MM-DD"
          required
        />

        {/* Mobile Number */}
        <TextField
          label="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        {/* Gender */}
        <TextField
          label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          fullWidth
          margin="normal"
          select
          required
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

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

        {/* Religion */}
        <TextField
          label="Religion"
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        {/* Course (pcm, pcb, etc.) */}
        <TextField
          label="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          fullWidth
          margin="normal"
          select
          required
        >
          <MenuItem value="pcm">PCM</MenuItem>
          <MenuItem value="pcb">PCB</MenuItem>
          <MenuItem value="pcmb">PCMB</MenuItem>
        </TextField>

        {/* Stream (science, commerce, arts) */}
        <TextField
          label="Stream"
          value={stream}
          onChange={(e) => setStream(e.target.value)}
          fullWidth
          margin="normal"
          select
          required
        >
          <MenuItem value="science">Science</MenuItem>
          <MenuItem value="commerce">Commerce</MenuItem>
          <MenuItem value="arts">Arts</MenuItem>
        </TextField>

        {/* Degree (bsc, bca, b.a, bcom, bba) */}
        <TextField
          label="Degree"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          fullWidth
          margin="normal"
          select
          required
        >
          <MenuItem value="bsc">B.Sc</MenuItem>
          <MenuItem value="bca">B.C.A</MenuItem>
          <MenuItem value="ba">B.A</MenuItem>
          <MenuItem value="bcom">B.Com</MenuItem>
          <MenuItem value="bba">B.B.A</MenuItem>
        </TextField>

        {/* Category (general, obc, sc, st, mbc, bcm) */}
        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          margin="normal"
          select
          required
        >
          <MenuItem value="general">General</MenuItem>
          <MenuItem value="obc">OBC</MenuItem>
          <MenuItem value="sc">SC</MenuItem>
          <MenuItem value="st">ST</MenuItem>
          <MenuItem value="mbc">MBC</MenuItem>
          <MenuItem value="bcm">BCM</MenuItem>
        </TextField>

        {/* Class 12 Percentage (can be "85", "85.0", or "85%") */}
        <TextField
          label="Class 12 Percentage"
          value={class12Percentage}
          onChange={(e) => setClass12Percentage(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="e.g. 85%"
          required
        />

        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Predict
        </Button>
      </form>

      {/* Display the prediction result if present */}
      {result && (
        <Box sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
          <Typography variant="h6">Prediction Result</Typography>
          <Typography>
            Seat Selection Probability: {result.seat_selection_probability}%
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Home;
