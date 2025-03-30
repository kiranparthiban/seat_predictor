import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Button,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  height: '100%',
  overflow: 'hidden',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  maxHeight: 'calc(100vh - 280px)',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  padding: theme.spacing(1.5),
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(1.5),
}));

const AdminHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4),
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [logins, setLogins] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch login data
      const loginResponse = await fetch(
        'http://127.0.0.1:8000/auth/admin/logins/?admin_user=admin&admin_pass=admin123', 
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      
      if (!loginResponse.ok) {
        if (loginResponse.status === 401) {
          // Unauthorized, redirect to login
          navigate('/login');
          return;
        }
        throw new Error(`Failed to fetch login data: ${loginResponse.statusText}`);
      }
      
      const loginData = await loginResponse.json();
      setLogins(loginData.logins);
      
      // Fetch prediction data
      const predictionResponse = await fetch(
        'http://127.0.0.1:8000/auth/admin/predictions/?admin_user=admin&admin_pass=admin123',
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      
      if (!predictionResponse.ok) {
        throw new Error(`Failed to fetch prediction data: ${predictionResponse.statusText}`);
      }
      
      const predictionData = await predictionResponse.json();
      setPredictions(predictionData.predictions);
      
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/auth/logout/', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    fetchAdminData();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchAdminData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  if (loading && logins.length === 0 && predictions.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <AdminHeader>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Admin Dashboard
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </AdminHeader>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <StyledPaper>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            aria-label="admin dashboard tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<PeopleIcon />} 
              label="User Logins" 
              iconPosition="start"
              sx={{ fontWeight: 600 }}
            />
            <Tab 
              icon={<AssessmentIcon />} 
              label="Prediction Results" 
              iconPosition="start"
              sx={{ fontWeight: 600 }}
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Recent User Logins
            </Typography>
            <StyledTableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableHeaderCell>User</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Login Time</StyledTableHeaderCell>
                    <StyledTableHeaderCell>IP Address</StyledTableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logins.length > 0 ? (
                    logins.map((login) => (
                      <TableRow key={login.id} hover>
                        <StyledTableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                mr: 1,
                                bgcolor: login.username === 'admin' ? 'error.main' : 'primary.main'
                              }}
                            >
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="body2">
                              {login.username}
                              {login.username === 'admin' && (
                                <Chip
                                  label="Admin"
                                  size="small"
                                  color="error"
                                  sx={{ ml: 1, height: 20 }}
                                />
                              )}
                            </Typography>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>{formatDateTime(login.login_time)}</StyledTableCell>
                        <StyledTableCell>{login.ip_address || 'Unknown'}</StyledTableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <StyledTableCell colSpan={3} align="center">
                        {loading ? (
                          <CircularProgress size={24} sx={{ my: 2 }} />
                        ) : (
                          'No login data available'
                        )}
                      </StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Recent Prediction Results
            </Typography>
            <StyledTableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableHeaderCell>User</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Timestamp</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Class 12 %</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Stream</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Result %</StyledTableHeaderCell>
                    <StyledTableHeaderCell>Model</StyledTableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predictions.length > 0 ? (
                    predictions.map((prediction) => (
                      <TableRow key={prediction.id} hover>
                        <StyledTableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                mr: 1,
                                bgcolor: prediction.username === 'admin' ? 'error.main' : 'primary.main'
                              }}
                            >
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="body2">
                              {prediction.username}
                            </Typography>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>{formatDateTime(prediction.timestamp)}</StyledTableCell>
                        <StyledTableCell>{prediction.class_12_percentage.toFixed(2)}%</StyledTableCell>
                        <StyledTableCell>
                          <Chip
                            icon={<SchoolIcon fontSize="small" />}
                            label={prediction.college_stream || 'N/A'}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Chip
                            label={`${prediction.result_percentage.toFixed(2)}%`}
                            size="small"
                            color={
                              prediction.result_percentage >= 75 ? 'success' :
                              prediction.result_percentage >= 50 ? 'primary' :
                              prediction.result_percentage >= 25 ? 'warning' : 'error'
                            }
                          />
                        </StyledTableCell>
                        <StyledTableCell>{prediction.model_used}</StyledTableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <StyledTableCell colSpan={6} align="center">
                        {loading ? (
                          <CircularProgress size={24} sx={{ my: 2 }} />
                        ) : (
                          'No prediction data available'
                        )}
                      </StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </TabPanel>
        </StyledPaper>
      </Container>
    </motion.div>
  );
}

export default AdminDashboard;
