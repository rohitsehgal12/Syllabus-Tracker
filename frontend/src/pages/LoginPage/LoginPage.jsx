import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify'; // <-- Import toast
import './AuthForm.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
      
      const { token } = response.data;
      const decodedUser = jwtDecode(token);
      login(decodedUser.user, token);
      
      toast.success('Login successful!'); // <-- Replace alert with toast.success
      
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Invalid Credentials';
      toast.error(errorMessage); // <-- Replace alert with toast.error
    }
  };

  // ... rest of the component is the same
  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-subtitle">Sign in to track your progress</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;