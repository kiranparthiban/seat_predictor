// src/pages/About.jsx
import { Box, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";

function About() {
  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: "0 auto" }}>
      {/* Project Title */}
      <Typography variant="h4" gutterBottom>
        About the MCC Seat Predictor
      </Typography>

      {/* Introduction / Overview */}
      <Typography variant="body1" paragraph>
        The <strong>MCC Seat Predictor</strong> is a web-based application designed to help prospective students
        estimate their chances of securing admission to <em>Madras Christian College (MCC)</em>. By entering details
        such as personal information, academic performance, and category, users can receive an AI-generated prediction
        of their likelihood of being admitted.
      </Typography>

      {/* Purpose / Goals */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Purpose and Goals
      </Typography>
      <Typography variant="body1" paragraph>
        The primary goal of this project is to provide students with a quick and user-friendly way to gauge their
        chances of admission. It streamlines the process of exploring various courses, streams, and degrees, while
        offering insights based on the user’s 12th-grade percentage and category. The predictions are for guidance
        only and do not guarantee final admissions decisions.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Technology Stack */}
      <Typography variant="h5" gutterBottom>
        Technology Stack
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText
            primary="Frontend: React + Vite"
            secondary="A fast and modern development environment, using Material UI for styling and components."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Backend: Django"
            secondary="Handles user authentication, seat prediction logic, and data handling via REST-like endpoints."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="AI Engine"
            secondary="A custom AI/ML module (ai_engine) integrated into Django’s predict_view for generating seat selection probabilities."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Material UI"
            secondary="Provides a robust set of pre-built React components and theming support for a modern, responsive design."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Deployment"
            secondary="Can be containerized (Docker) or hosted on services like Heroku or AWS, with a build step for the React frontend."
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      {/* Key Features */}
      <Typography variant="h5" gutterBottom>
        Key Features
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText
            primary="User Registration & Login"
            secondary="New users can sign up with their username, email, and phone number. Existing users can log in securely."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Seat Prediction"
            secondary="Enter personal details (name, DOB, gender, etc.) and academic info (class 12th marks). The system returns a probability of seat selection."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Multiple Streams & Courses"
            secondary="Users can choose from PCM, PCB, PCMB, as well as various degrees (B.Sc, B.C.A, B.A, B.Com, B.B.A)."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="AI-Driven Probability"
            secondary="The prediction engine uses a neural network (or other ML model) for calculating seat selection probability based on user inputs."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Results Page"
            secondary="Displays a clear message with the predicted chance of admission, plus additional info like the official MCC website."
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      {/* Usage Instructions */}
      <Typography variant="h5" gutterBottom>
        How to Use
      </Typography>
      <Typography variant="body1" paragraph>
        1. <strong>Register or Login:</strong> Access the <em>Register</em> page if you’re new, or <em>Login</em> if
        you already have an account.
      </Typography>
      <Typography variant="body1" paragraph>
        2. <strong>Enter Details:</strong> Go to the Home page and fill in the required fields: name, date of birth,
        gender, email, class 12 percentage, etc.
      </Typography>
      <Typography variant="body1" paragraph>
        3. <strong>Predict:</strong> Click the “Predict” button to submit your data to the AI engine. Once the
        backend processes your information, you’ll be redirected to the <em>Result</em> page with your seat selection
        probability.
      </Typography>
      <Typography variant="body1" paragraph>
        4. <strong>View Outcome:</strong> The result page shows a personalized message with your estimated chance of
        admission. You can also return to the Home page to re-submit with different details.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Disclaimer */}
      <Typography variant="body2" sx={{ mt: 2 }}>
        <em>
          Disclaimer: This application provides an estimation based on AI models and does not guarantee actual
          admission. Always verify official college guidelines and procedures for accurate admissions information.
        </em>
      </Typography>
    </Box>
  );
}

export default About;
