// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Result from "./pages/Result";
import Home from "./pages/Home"; // <-- Import our new Home page

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Homepage now points to Home component */}
        <Route path="/" element={<Home />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Other pages */}
        <Route path="/about" element={<About />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
