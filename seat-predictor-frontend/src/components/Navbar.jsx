import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useScrollTrigger,
  Container,
  Avatar,
  Fade,
  useTheme,
  useMediaQuery,
  Chip
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import { 
  Menu as MenuIcon, 
  School, 
  Home, 
  Info, 
  Assessment, 
  Dashboard, 
  Logout,
  SupervisorAccount
} from "@mui/icons-material";
import { useState, useEffect } from "react";

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme, $trigger }) => ({
  backgroundImage: "url('/bgmcc.jpg')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: $trigger 
      ? 'rgba(0, 0, 0, 0.7)'
      : 'rgba(0, 0, 0, 0.5)',
    backdropFilter: $trigger ? 'blur(5px)' : 'none',
    transition: 'all 0.3s ease-in-out',
    zIndex: -1,
  },
  transition: 'all 0.3s ease-in-out',
}));

const NavButton = styled(Button)(({ theme, $active }) => ({
  position: 'relative',
  margin: theme.spacing(0, 1),
  color: '#ffffff',
  fontWeight: $active ? 600 : 400,
  '&::after': {
    content: '""',
    position: 'absolute',
    width: $active ? '100%' : '0%',
    height: '2px',
    bottom: '0',
    left: '0',
    backgroundColor: '#ffffff',
    transition: 'width 0.3s ease-in-out',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&::after': {
      width: '100%',
    },
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& img': {
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  // Check if current path is admin dashboard
  useEffect(() => {
    setIsAdmin(location.pathname === '/admin-dashboard');
    setIsLoggedIn(
      location.pathname === '/home' || 
      location.pathname === '/result' || 
      location.pathname === '/admin-dashboard'
    );
  }, [location.pathname]);

  // Define navigation items based on user type
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { text: 'Dashboard', path: '/admin-dashboard', icon: <Dashboard sx={{ color: '#ffffff' }} /> },
      ];
    } else if (isLoggedIn) {
      return [
        { text: 'Home', path: '/home', icon: <Home sx={{ color: '#ffffff' }} /> },
        { text: 'About', path: '/about', icon: <Info sx={{ color: '#ffffff' }} /> },
        { text: 'Result', path: '/result', icon: <Assessment sx={{ color: '#ffffff' }} /> },
      ];
    } else {
      return [
        { text: 'Login', path: '/login', icon: <Home sx={{ color: '#ffffff' }} /> },
        { text: 'About', path: '/about', icon: <Info sx={{ color: '#ffffff' }} /> },
      ];
    }
  };

  const navItems = getNavItems();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/auth/logout/', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear authentication data from session storage
      sessionStorage.removeItem('authStatus');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('username');
      
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const drawer = (
    <Box 
      sx={{ 
        textAlign: 'center', 
        pt: 2,
        backgroundImage: "url('/bgmcc.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: '100%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Avatar
          src="/mcc_logo.jpg"
          alt="MCC Logo"
          sx={{ 
            width: 80, 
            height: 80, 
            margin: '0 auto',
            mb: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#ffffff',
            mb: 1,
            fontWeight: 600,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          MCC Predictor
        </Typography>
        
        {isAdmin && (
          <Chip
            icon={<SupervisorAccount sx={{ color: '#fff !important' }} />}
            label="Admin Panel"
            sx={{ 
              mb: 3, 
              bgcolor: 'error.main', 
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
        )}
        
        <List>
          {navItems.map((item) => (
            <ListItem 
              key={item.text} 
              component={Link} 
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                color: '#ffffff',
                backgroundColor: location.pathname === item.path 
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'transparent',
                borderRadius: 1,
                mb: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <Box sx={{ mr: 2 }}>{item.icon}</Box>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }
                }}
              />
            </ListItem>
          ))}
          
          {isLoggedIn && (
            <ListItem 
              onClick={handleLogout}
              sx={{
                color: '#ffffff',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderRadius: 1,
                mb: 1,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',
                },
              }}
            >
              <Box sx={{ mr: 2 }}><Logout sx={{ color: '#ffffff' }} /></Box>
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 500,
                  }
                }}
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="fixed" $trigger={trigger}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            <LogoContainer>
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Avatar
                  src="/mcc_logo.jpg"
                  alt="MCC Logo"
                  sx={{ 
                    width: 50, 
                    height: 50,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                />
              </motion.div>
              <Fade in timeout={1000}>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      display: { xs: 'none', sm: 'block' },
                      fontWeight: 600,
                      color: '#ffffff',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    MCC College Admission Predictor
                  </Typography>
                  
                  {isAdmin && (
                    <Chip
                      size="small"
                      icon={<SupervisorAccount sx={{ color: '#fff !important' }} />}
                      label="Admin Panel"
                      sx={{ 
                        display: { xs: 'none', sm: 'inline-flex' },
                        bgcolor: 'error.main', 
                        color: 'white',
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                    />
                  )}
                </Box>
              </Fade>
            </LogoContainer>

            {isMobile ? (
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: '#ffffff' }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  background: trigger ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                }}
              >
                {navItems.map((item) => (
                  <NavButton
                    key={item.text}
                    component={Link}
                    to={item.path}
                    $active={location.pathname === item.path}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </NavButton>
                ))}
                
                {isLoggedIn && (
                  <NavButton
                    onClick={handleLogout}
                    startIcon={<Logout />}
                    sx={{ color: theme.palette.error.light }}
                  >
                    Logout
                  </NavButton>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      <Toolbar />
    </>
  );
}

export default Navbar;