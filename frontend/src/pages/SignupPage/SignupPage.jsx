import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../LoginPage/AuthForm.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, email, password };

    try {
      const response = await axios.post('https://syllabus-tracker-backend-7w7a.onrender.com/api/users/register', newUser);
      console.log('Registration successful! Token:', response.data.token);
      // alert('Account created successfully! Please log in.');
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Could not connect to the server. Please make sure your backend is running.';
      console.error('Registration failed:', errorMessage);
      // alert(`Registration failed: ${errorMessage}`);
      toast.error(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">Start your syllabus tracking journey</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Rohit Kumar"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 6 characters"
            />
          </div>
          <button type="submit" className="auth-button">Create Account</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
