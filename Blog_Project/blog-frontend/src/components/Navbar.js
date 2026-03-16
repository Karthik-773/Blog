import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/home" className="nav-logo">BlogHub</Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/trending" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Trending</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Create</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
          </li>
          <li className="nav-item">
            <span className="nav-user">{user?.username}</span>
          </li>
          <li className="nav-item">
            <ThemeToggle />
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-logout">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
