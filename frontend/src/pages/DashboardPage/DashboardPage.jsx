import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import SubjectProgressBarChart from '../../components/charts/SubjectProgressBarChart';
import './DashboardPage.css';

import { jeeSyllabus } from '../Jeepage/JEEPage';
import { mainSubjects as sscSyllabus } from '../Sscpage/SSCPage';

// Helper function to calculate total topics for a given syllabus structure
const calculateTotalTopics = (syllabusArray) => {
  let total = 0;
  syllabusArray.forEach(subject => {
    // This handles structures like SSC's which have a 'details' property
    const details = subject.details || subject.subCategories || [];
    details.forEach(category => {
      if (category.topics) {
        total += category.topics.length;
      }
      if (category.subCategories) {
        category.subCategories.forEach(sub => {
          if (sub.topics) total += sub.topics.length;
        });
      }
    });
  });
  return total;
};

// Helper function to prepare data for charts
const prepareChartData = (syllabus, progress) => {
  return syllabus.map(subject => {
    const details = subject.details || subject.subCategories || [];
    let totalTopics = 0;
    let completedTopics = 0;
    
    details.forEach(category => {
      if (category.topics) {
        totalTopics += category.topics.length;
        completedTopics += category.topics.filter(topic => progress[topic]).length;
      }
      if (category.subCategories) {
        category.subCategories.forEach(sub => {
          if(sub.topics) {
            totalTopics += sub.topics.length;
            completedTopics += sub.topics.filter(topic => progress[topic]).length;
          }
        })
      }
    });
    const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    return { subject: subject.name || subject.category, Progress: percentage };
  });
};


const DashboardPage = () => {
  const [progress, setProgress] = useState({ jee: {}, ssc: {} });
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProgress = async () => {
      if (token) {
        try {
          const config = { headers: { 'x-auth-token': token } };
          const res = await axios.get('https://syllabus-tracker-backend-7w7a.onrender.com/api/progress', config);
          setProgress(res.data || { jee: {}, ssc: {} });
        } catch (err) { console.error('Could not fetch progress', err); }
      }
    };
    fetchProgress();
  }, [token]);

  // Calculate overall totals
  const totalJeeTopics = useMemo(() => calculateTotalTopics(jeeSyllabus), []);
  const totalSscTopics = useMemo(() => calculateTotalTopics(sscSyllabus), []);

  const completedJeeTopics = Object.values(progress.jee || {}).filter(Boolean).length;
  const completedSscTopics = Object.values(progress.ssc || {}).filter(Boolean).length;

  const jeePercentage = totalJeeTopics > 0 ? Math.round((completedJeeTopics / totalJeeTopics) * 100) : 0;
  const sscPercentage = totalSscTopics > 0 ? Math.round((completedSscTopics / totalSscTopics) * 100) : 0;
  
  // Prepare chart data
  const jeeChartData = useMemo(() => prepareChartData(jeeSyllabus, progress.jee || {}), [progress.jee]);
  const sscChartData = useMemo(() => prepareChartData(sscSyllabus, progress.ssc || {}), [progress.ssc]);
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's a summary of your syllabus progress.</p>
      </div>
      <div className="progress-cards-container">
        {/* JEE Progress Card */}
        <div className="progress-card jee-card">
          <h2>🚀 JEE Progress</h2>
          {/* --- THIS IS THE NEW SUMMARY SECTION --- */}
          <div className="progress-summary">
            <div className="overall-percentage">{jeePercentage}%</div>
            <p className="topic-count">{completedJeeTopics} of {totalJeeTopics} topics completed</p>
          </div>
          {/* --- END OF SUMMARY --- */}
          <h3 className="chart-title">Subject-wise Breakdown</h3>
          <SubjectProgressBarChart data={jeeChartData} />
          <Link to="/jee" className="details-button">View Detailed Syllabus</Link>
        </div>
        
        {/* SSC Progress Card */}
        <div className="progress-card ssc-card">
          <h2>🏛️ SSC Progress</h2>
           {/* --- THIS IS THE NEW SUMMARY SECTION --- */}
          <div className="progress-summary">
            <div className="overall-percentage">{sscPercentage}%</div>
            <p className="topic-count">{completedSscTopics} of {totalSscTopics} topics completed</p>
          </div>
          {/* --- END OF SUMMARY --- */}
          <h3 className="chart-title">Subject-wise Breakdown</h3>
          <SubjectProgressBarChart data={sscChartData} />
          <Link to="/ssc" className="details-button">View Detailed Syllabus</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
