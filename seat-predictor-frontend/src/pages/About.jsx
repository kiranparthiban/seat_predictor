
import { Box, Typography, Divider, List, ListItem, ListItemText, Paper, Container, IconButton, Collapse } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  ExpandMore, 
  School, 
  Build, 
  Stars, 
  Assignment, 
  HowToReg,
  Code,
  Psychology,
  Storage,
  Cloud,
  Login,
  Calculate,
  School as SchoolIcon,
  ModelTraining,
  PreviewOutlined
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
  },
}));

const ExpandMoreButton = styled(IconButton)(({ theme, expanded }) => ({
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.3s',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: 'background-color 0.3s',
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

function About() {
  const [expandedSections, setExpandedSections] = useState({
    techStack: true,
    features: true,
    howToUse: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Container maxWidth="md">
      <MotionBox
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: 4 }}
      >
        {/* Hero Section */}
        <StyledPaper 
          elevation={0} 
          sx={{ 
            textAlign: 'center', 
            mb: 6, 
            p: 6, 
            background: 'linear-gradient(145deg, #f7f9fc 0%, #e3f2fd 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <School 
            sx={{ 
              position: 'absolute', 
              top: -20, 
              right: -20, 
              fontSize: 120, 
              opacity: 0.1,
              transform: 'rotate(15deg)'
            }} 
          />
          <MotionTypography
            variant="h3"
            gutterBottom
            component={motion.h3}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            MCC Seat Predictor
          </MotionTypography>
          <MotionTypography
            variant="h6"
            color="textSecondary"
            sx={{ mb: 3 }}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your AI-Powered Admission Assistant
          </MotionTypography>
        </StyledPaper>

        {/* Introduction Section */}
        <MotionBox variants={itemVariants}>
          <StyledPaper>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              The <strong>MCC Seat Predictor</strong> is a sophisticated web-based application designed to help prospective students
              estimate their chances of securing admission to <em>Madras Christian College (MCC)</em>. Using advanced AI algorithms,
              we process your academic performance and personal details to provide accurate admission predictions.
            </Typography>
          </StyledPaper>
        </MotionBox>

        {/* Technology Stack Section */}
        <MotionBox variants={itemVariants}>
          <StyledPaper>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Build sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5">Technology Stack</Typography>
              </Box>
              <ExpandMoreButton
                onClick={() => toggleSection('techStack')}
                expanded={expandedSections.techStack}
              >
                <ExpandMore />
              </ExpandMoreButton>
            </Box>
            <Collapse in={expandedSections.techStack}>
              <List>
                <StyledListItem>
                  <Code sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary="Frontend: React + Vite"
                    secondary="A fast and modern development environment, using Material UI for styling and components."
                  />
                </StyledListItem>
                <StyledListItem>
                  <Storage sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary="Backend: Django"
                    secondary="Handles user authentication, seat prediction logic, and data handling via REST-like endpoints."
                  />
                </StyledListItem>
                <StyledListItem>
                  <Psychology sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary="AI Engine"
                    secondary="A custom AI/ML module integrated into Django's predict_view for generating seat selection probabilities."
                  />
                </StyledListItem>
                <StyledListItem>
                  <Build sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary="Material UI"
                    secondary="Provides a robust set of pre-built React components and theming support for a modern, responsive design."
                  />
                </StyledListItem>
                <StyledListItem>
                  <Cloud sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary="Deployment"
                    secondary="Containerized with Docker for easy deployment on cloud platforms like Heroku or AWS."
                  />
                </StyledListItem>
              </List>
            </Collapse>
          </StyledPaper>
        </MotionBox>

        {/* Features Section */}
        <MotionBox variants={itemVariants}>
          <StyledPaper>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Stars sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5">Key Features</Typography>
              </Box>
              <ExpandMoreButton
                onClick={() => toggleSection('features')}
                expanded={expandedSections.features}
              >
                <ExpandMore />
              </ExpandMoreButton>
            </Box>
            <Collapse in={expandedSections.features}>
              <List>
                <StyledListItem>
                  <Login sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary="User Registration & Login"
                    secondary="Secure authentication system with email verification and password recovery."
                  />
                </StyledListItem>
                <StyledListItem>
                  <Calculate sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary="Seat Prediction"
                    secondary="Advanced algorithms process your academic and personal data for accurate predictions."
                  />
                </StyledListItem>
                <StyledListItem>
                  <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary="Multiple Streams & Courses"
                    secondary="Comprehensive coverage of PCM, PCB, PCMB streams and various degree programs."
                  />
                </StyledListItem>
                <StyledListItem>
                  <ModelTraining sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary="AI-Driven Probability"
                    secondary="Choose from multiple AI models: Neural Network, XGBoost, or Logistic Regression."
                  />
                </StyledListItem>
                <StyledListItem>
                  <PreviewOutlined sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary="Results Dashboard"
                    secondary="Clear visualization of prediction results with detailed insights."
                  />
                </StyledListItem>
              </List>
            </Collapse>
          </StyledPaper>
        </MotionBox>

        {/* How to Use Section */}
        <MotionBox variants={itemVariants}>
          <StyledPaper>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5">How to Use</Typography>
              </Box>
              <ExpandMoreButton
                onClick={() => toggleSection('howToUse')}
                expanded={expandedSections.howToUse}
              >
                <ExpandMore />
              </ExpandMoreButton>
            </Box>
            <Collapse in={expandedSections.howToUse}>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Box component="span" sx={{ 
                    mr: 2, 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>1</Box>
                  <strong>Register or Login:</strong> Create a new account or sign in to your existing one.
                </Typography>
                <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ 
                    mr: 2, 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>2</Box>
                  <strong>Enter Details:</strong> Provide your academic and personal information.
                </Typography>
                <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ 
                    mr: 2, 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>3</Box>
                  <strong>Choose Model:</strong> Select your preferred AI model for prediction.
                </Typography>
                <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ 
                    mr: 2, 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>4</Box>
                  <strong>Get Results:</strong> Review your personalized admission probability.
                </Typography>
              </Box>
            </Collapse>
          </StyledPaper>
        </MotionBox>

        {/* Disclaimer */}
        <MotionBox variants={itemVariants}>
          <StyledPaper sx={{ 
            background: 'linear-gradient(145deg, #fff8e1 0%, #fffde7 100%)',
            border: '1px solid #fff176'
          }}>
            <Typography variant="body2" sx={{ 
              fontStyle: 'italic', 
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Box component="span" sx={{ 
                mr: 2,
                color: 'warning.main',
                display: 'flex',
                alignItems: 'center'
              }}>
                ⚠️
              </Box>
              This application provides an estimation based on AI models and does not guarantee actual
              admission. Always verify official college guidelines and procedures for accurate admissions information.
            </Typography>
          </StyledPaper>
        </MotionBox>
      </MotionBox>
    </Container>
  );
}

export default About;