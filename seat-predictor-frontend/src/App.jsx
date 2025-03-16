// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Result from "./pages/Result";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import "./index.css"; // Global CSS import

function App() {
  return (
    <Router>
      <Layout>
        {/* Navbar is rendered once, above all routes, on top of the background */}
        <Navbar />

        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Other routes */}
          <Route path="/about" element={<About />} />
          <Route path="/home" element={<Home />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
