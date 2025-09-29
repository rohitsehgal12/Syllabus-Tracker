import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import the new CSS

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <main className="hero-section">
        <h1 className="hero-title">Master Your Syllabus, Ace Your Exams.</h1>
        <p className="hero-subtitle">
          The ultimate tracker for JEE and SSC aspirants. Visualize your progress,
          stay motivated, and conquer your goals.
        </p>
        <button className="hero-cta" onClick={() => navigate('/jee')}>
          Start Tracking Now
        </button>
      </main>

      <section className="exam-choice-section">
        <h2 className="section-title">Choose Your Path</h2>
        <div className="cards-wrapper">
          {/* JEE Card */}
          <div className="exam-card" onClick={() => navigate('/jee')}>
            <div className="exam-icon">🚀</div>
            <h3 className="exam-title">JEE</h3>
            <p className="exam-description">
              Track Physics, Chemistry & Maths with precision.
            </p>
          </div>

          {/* SSC Card */}
          <div className="exam-card" onClick={() => navigate('/ssc')}>
            <div className="exam-icon">🏛️</div>
            <h3 className="exam-title">SSC</h3>
            <p className="exam-description">
              Monitor Quant, Reasoning, English & GA.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;