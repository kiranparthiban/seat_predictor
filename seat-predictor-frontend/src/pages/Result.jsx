import React, { useEffect } from "react";
import { Box, Button, Typography, Link, Paper, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import confetti from "canvas-confetti";
import { School, ArrowBack, Launch } from "@mui/icons-material";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
}));

const ProgressCircle = styled(Box)(({ theme, probability }) => ({
  position: 'relative',
  width: '200px',
  height: '200px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiCircularProgress-root': {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontSize: '1.1rem',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state;
  const probability = resultData ? parseFloat(resultData.seat_selection_probability) : 0;

  useEffect(() => {
    // Trigger confetti animation if probability is above 60%
    if (probability >= 60) {
      const duration = 2000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#1976d2', '#9c27b0', '#4caf50']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#1976d2', '#9c27b0', '#4caf50']
        });
      }, 50);
    }
  }, [probability]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            maxWidth: 600,
            margin: "40px auto",
            padding: 2,
          }}
        >
          <StyledPaper elevation={3}>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                <School 
                  sx={{ 
                    fontSize: 40, 
                    color: 'primary.main',
                    opacity: 0.1,
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    transform: 'rotate(15deg)'
                  }} 
                />
                
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Your Admission Prediction
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Madras Christian College
                </Typography>

                <ProgressCircle probability={probability}>
                  <CircularProgress
                    variant="determinate"
                    value={probability}
                    size={200}
                    thickness={4}
                    sx={{
                      color: probability >= 60 ? 'success.main' : 
                             probability >= 40 ? 'warning.main' : 'error.main'
                    }}
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: probability >= 60 ? 'success.main' : 
                               probability >= 40 ? 'warning.main' : 'error.main'
                      }}
                    >
                      {probability}%
                    </Typography>
                  </motion.div>
                </ProgressCircle>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {probability >= 60 ? "Congratulations! Your chances look promising!" :
                     probability >= 40 ? "You have a moderate chance of admission." :
                     "Your chances are lower, but don't give up!"}
                  </Typography>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <ActionButton
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/home")}
                  >
                    Try Again
                  </ActionButton>
                  <ActionButton
                    variant="contained"
                    endIcon={<Launch />}
                    href="https://mcc.edu.in/admission/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit MCC Website
                  </ActionButton>
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 4,
                    p: 2,
                    bgcolor: 'info.light',
                    borderRadius: 2,
                    color: 'info.dark'
                  }}
                >
                  Note: This is a predictive estimate based on historical data. 
                  Final admission decisions may vary. Please refer to the official admission guidelines.
                </Typography>
              </Box>
            </motion.div>
          </StyledPaper>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}

export default Result;