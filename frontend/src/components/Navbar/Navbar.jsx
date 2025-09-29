import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control the mobile menu
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close menu on logout
    navigate('/login');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  return (
    <nav className="navbar-glass">
      <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
        📚 Syllabus Tracker
      </NavLink>

      {/* Hamburger Menu Toggle Button */}
      <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Add conditional class for open/closed state */}
      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        {user ? (
          // If user is logged in
          <>
            <li className="navbar-user-greeting">
              <span className="user-icon">👤</span>
              <span>{user.name}</span>
            </li>
            <li>
              <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/planner" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Planner
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="nav-link logout-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          // If user is logged out
          <>
            <li>
              <NavLink to="/jee" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                JEE
              </NavLink>
            </li>
            <li>
              <NavLink to="/ssc" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                SSC
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Login
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;