import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import TrendingBlogs from './pages/TrendingBlogs';
import CreateBlog from './pages/CreateBlog';
import DedicatedBlogs from './pages/DedicatedBlogs';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import BackToTopButton from './components/BackToTopButton';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/trending" element={<ProtectedRoute><TrendingBlogs /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/blog/:id" element={<ProtectedRoute><DedicatedBlogs /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <BackToTopButton />
    </Router>
  );
}

export default App;
