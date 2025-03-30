// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Result from "./pages/Result";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css"; // Global CSS import

function App() {
  return (
    <Router>
      <Layout>
        {/* Navbar is rendered once, above all routes, on top of the background */}
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          {/* Protected student routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute requiredRole="student">
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/result" 
            element={
              <ProtectedRoute requiredRole="student">
                <Result />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected admin routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
