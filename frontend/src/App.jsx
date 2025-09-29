import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; // <-- 1. Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // <-- 2. Import the CSS


// import Card from './components/Card/Card'
import Navbar from './components/Navbar/Navbar'
// import Hero from './components/Hero/Hero'
import JEEPage from './pages/Jeepage/JEEPage'
import SSCPage from './pages/Sscpage/SSCPage';
import HomePage from './pages/HomePage/HomePage';
import './App.css'
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import DashboardPage from './pages/DashboardPage/DashboardPage'; // <-- Import Dashboard
// import ProtectedRoute from './components/ProtectedRoute'; 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PlannerPage from './pages/PlannerPage/PlannerPage';







function App() {

  return (

    <>


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="light"
      />


      <header className="navbar">
        <div className="container navbar-inner">
          <Navbar />
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/jee" element={<ProtectedRoute><JEEPage /></ProtectedRoute>} />
        <Route path="/ssc" element={<ProtectedRoute><SSCPage /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><PlannerPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>

  )
}

export default App
