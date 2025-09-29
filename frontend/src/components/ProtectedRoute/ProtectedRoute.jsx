import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    // If user is not logged in, redirect them to the login page
    return <Navigate to="/login" />;
  }

  return children; // If logged in, show the component
};

export default ProtectedRoute;