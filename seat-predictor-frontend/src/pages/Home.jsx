import React, { useState } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  MenuItem, 
  Stepper,
  Step,
  StepLabel,
  Paper,
  Container,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
}));

function Home() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // State for form fields
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
  // New state for model choice
  const [modelChoice, setModelChoice] = useState("nn");
  const [class12Percentage, setClass12Percentage] = useState("");

  // Form steps configuration
  const steps = [
    {
      label: "Personal Information",
      fields: [
        {
          component: (
            <StyledTextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          ),
        },
        {
          component: (
            <StyledTextField
              label="Date of Birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
          ),
        },
        {
          component: (
            <StyledTextField
              label="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          ),
        },
      ],
    },
    {
      label: "Basic Details",
      fields: [
        {
          component: (
            <StyledTextField
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
            </StyledTextField>
          ),
        },
        {
          component: (
            <StyledTextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              type="email"
              required
            />
          ),
        },
        {
          component: (
            <StyledTextField
              label="Religion"
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          ),
        },
      ],
    },
    {
      label: "Academic Details",
      fields: [
        {
          component: (
            <StyledTextField
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
            </StyledTextField>
          ),
        },
        {
          component: (
            <StyledTextField
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
            </StyledTextField>
          ),
        },
        {
          component: (
            <StyledTextField
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
            </StyledTextField>
          ),
        },
      ],
    },
    {
      label: "Final Details",
      fields: [
        {
          component: (
            <StyledTextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              margin="normal"
              select
              required
            >
              <MenuItem value="1">General</MenuItem>
              <MenuItem value="2">OBC</MenuItem>
              <MenuItem value="3">SC</MenuItem>
              <MenuItem value="4">ST</MenuItem>
              <MenuItem value="5">MBC</MenuItem>
              <MenuItem value="6">BCM</MenuItem>
            </StyledTextField>
          ),
        },
        {
          component: (
            <StyledTextField
              label="Class 12 Percentage"
              value={class12Percentage}
              onChange={(e) => setClass12Percentage(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="e.g. 85% or 85"
              required
            />
          ),
        },
        {
          component: (
            <StyledTextField
              label="Model Choice"
              value={modelChoice}
              onChange={(e) => setModelChoice(e.target.value)}
              fullWidth
              margin="normal"
              select
              required
            >
              <MenuItem value="nn">FeedForward Neural Network</MenuItem>
              <MenuItem value="xgb">XGBoost Classifier</MenuItem>
              <MenuItem value="log">Logistic Regression</MenuItem>
            </StyledTextField>
          ),
        },
      ],
    },
  ];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
          model: modelChoice, // <-- Pass the selected model to the backend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/result", { state: data });
      } else {
        alert(data.error || "Error occurred while predicting.");
      }
    } catch (error) {
      console.error("Predict error:", error);
      alert("Failed to connect to the prediction endpoint.");
    }
  };

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ my: 4 }}>
          <Typography 
            variant="h4" 
            textAlign="center" 
            sx={{ 
              mb: 4,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Seat Prediction System
          </Typography>

          <FormContainer>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              <Fade in={true} timeout={500}>
                <Box>
                  {steps[activeStep].fields.map((field, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {field.component}
                    </motion.div>
                  ))}
                </Box>
              </Fade>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      type="submit"
                      endIcon={<ArrowForward />}
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      }}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          </FormContainer>
        </Box>
      </motion.div>
    </Container>
  );
}

export default Home;
