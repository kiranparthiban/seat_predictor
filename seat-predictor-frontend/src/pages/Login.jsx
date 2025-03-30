import React, { useState } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Link, 
  Snackbar, 
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import { 
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  School,
  LoginOutlined,
  SupervisorAccount,
  AccountCircle
} from "@mui/icons-material";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  position: 'relative',
  overflow: 'hidden',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  '& .MuiInputLabel-root': {
    transition: 'color 0.2s ease-in-out',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  textTransform: 'none',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.spacing(1.5),
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
  fontWeight: 600,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("student");
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, user_type: userType }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // Store authentication info in session storage
        sessionStorage.setItem('authStatus', 'true');
        sessionStorage.setItem('userRole', data.is_admin ? 'admin' : 'student');
        sessionStorage.setItem('username', data.username);
        
        setSnackbarMessage(data.message || "Welcome back! Login successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        
        // Redirect based on user type
        if (data.is_admin) {
          setTimeout(() => {
            navigate("/admin-dashboard");
          }, 1000);
        } else {
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
      } else {
        // Clear any existing auth data
        sessionStorage.removeItem('authStatus');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('username');
        
        setSnackbarMessage(`Error: ${data.error || "Invalid credentials"}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
      
      // Clear any existing auth data
      sessionStorage.removeItem('authStatus');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('username');
      
      setSnackbarMessage("Network error. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

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
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
            background: 'linear-gradient(145deg, #f5f7fa 0%, #e8edf5 100%)',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <StyledPaper elevation={0}>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
                  <School 
                    sx={{ 
                      fontSize: 40, 
                      color: 'primary.main',
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      opacity: 0.1,
                      transform: 'rotate(15deg)'
                    }} 
                  />
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to continue to MCC Seat Predictor
                  </Typography>
                </Box>

                <StyledToggleButtonGroup
                  value={userType}
                  exclusive
                  onChange={handleUserTypeChange}
                  aria-label="user type"
                >
                  <StyledToggleButton value="student" aria-label="student login">
                    <AccountCircle sx={{ mr: 1 }} />
                    Student
                  </StyledToggleButton>
                  <StyledToggleButton value="admin" aria-label="admin login">
                    <SupervisorAccount sx={{ mr: 1 }} />
                    Admin
                  </StyledToggleButton>
                </StyledToggleButtonGroup>

                <form onSubmit={handleSubmit}>
                  <StyledTextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <StyledTextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <LoginButton
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <LoginOutlined />}
                  >
                    {loading ? "Signing in..." : userType === "admin" ? "Admin Sign In" : "Student Sign In"}
                  </LoginButton>
                </form>

                {userType === "student" && (
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{" "}
                      <Link 
                        component={RouterLink} 
                        to="/register"
                        sx={{ 
                          fontWeight: 500,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Create Account
                      </Link>
                    </Typography>
                  </Box>
                )}
                
                {userType === "admin" && (
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Admin credentials: admin / admin123
                    </Typography>
                  </Box>
                )}
              </motion.div>
            </StyledPaper>
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert 
              onClose={handleSnackbarClose} 
              severity={snackbarSeverity} 
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}

export default Login;