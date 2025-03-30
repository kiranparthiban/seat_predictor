import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// Protected route component that checks if user is authenticated and has correct role
const ProtectedRoute = ({ children, requiredRole }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Get auth status from session storage
        const storedAuth = sessionStorage.getItem('authStatus');
        const storedRole = sessionStorage.getItem('userRole');
        
        if (storedAuth === 'true' && storedRole) {
          setIsAuthenticated(true);
          setUserRole(storedRole);
          setIsLoading(false);
          return;
        }
        
        // If not in session storage or not authenticated, clear session and redirect
        sessionStorage.removeItem('authStatus');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('username');
        setIsAuthenticated(false);
        setUserRole(null);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        sessionStorage.removeItem('authStatus');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('username');
        setIsAuthenticated(false);
        setUserRole(null);
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [location.pathname]);
  
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If role check is required and user doesn't have the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect admin to admin dashboard
    if (userRole === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    
    // Redirect students to home
    return <Navigate to="/home" replace />;
  }
  
  // If authenticated and has correct role, render the children
  return children;
};

export default ProtectedRoute;
