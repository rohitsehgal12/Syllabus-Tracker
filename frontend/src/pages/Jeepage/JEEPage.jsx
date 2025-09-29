import React, { useState, useMemo, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import './JEEPage.css';

// --- Full JEE Syllabus Data (no change) ---
export const jeeSyllabus = [
  {
    category: 'Mathematics',
    subCategories: [ { name: 'Algebra', topics: ['Sets, Relations & Functions', 'Complex Numbers & Quadratic Equations', 'Matrices & Determinants', 'Permutations & Combinations', 'Mathematical Induction', 'Binomial Theorem & Its Applications', 'Sequences & Series'] }, { name: 'Calculus', topics: ['Limits, Continuity & Differentiability', 'Integral Calculus', 'Differential Equations'] }, { name: 'Coordinate Geometry', topics: ['Straight lines, Circles, Parabola, Ellipse, Hyperbola', 'Three Dimensional Geometry', 'Vector Algebra'] }, { name: 'Trigonometry', topics: ['Trigonometry'] }, { name: 'Statistics & Probability', topics: ['Statistics & Probability'] } ]
  },
  {
    category: 'Physics',
    subCategories: [ { name: 'Mechanics', topics: ['Units & Measurements', 'Kinematics', 'Laws of Motion', 'Work, Energy & Power', 'Rotational Motion', 'Gravitation'] }, { name: 'Properties of Matter & Thermodynamics', topics: ['Properties of Solids & Liquids', 'Thermodynamics', 'Kinetic Theory of Gases'] }, { name: 'Oscillations & Waves', topics: ['Oscillations & Waves'] }, { name: 'Electrodynamics', topics: ['Electrostatics', 'Current Electricity', 'Magnetic Effects of Current & Magnetism', 'Electromagnetic Induction & Alternating Current', 'Electromagnetic Waves'] }, { name: 'Optics', topics: ['Ray & Wave Optics'] }, { name: 'Modern Physics', topics: ['Dual Nature of Matter & Radiation', 'Atoms & Nuclei', 'Electronic Devices', 'Communication Systems'] } ]
  },
  {
    category: 'Chemistry',
    subCategories: [ { name: 'Physical Chemistry', topics: ['Some Basic Concepts of Chemistry', 'Atomic Structure', 'Chemical Bonding & Molecular Structure', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions & Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry'] }, { name: 'Inorganic Chemistry', topics: ['Classification of Elements & Periodicity', 'Hydrogen', 's-Block Elements', 'p-Block Elements', 'd-Block Elements', 'f-Block Elements', 'Coordination Compounds', 'Environmental Chemistry'] }, { name: 'Organic Chemistry', topics: ['Basic Principles of Organic Chemistry', 'Hydrocarbons', 'Haloalkanes & Haloarenes', 'Alcohols, Phenols & Ethers', 'Aldehydes, Ketones & Carboxylic Acids', 'Amines', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life'] } ]
  }
];

const JEEPage = () => {
  const [completedTopics, setCompletedTopics] = useState({});
  const [openSubject, setOpenSubject] = useState(null);
  const [openCategories, setOpenCategories] = useState([]);
  const { token } = useContext(AuthContext);

  // FETCH progress when the component loads
  useEffect(() => {
    const fetchProgress = async () => {
      if (token) {
        try {
          const config = { headers: { 'x-auth-token': token } };
          const res = await axios.get('https://syllabus-tracker-backend-7w7a.onrender.com/api/progress', config);
          // Set state from the 'jee' key in the response
          if (res.data && res.data.jee) {
            setCompletedTopics(res.data.jee);
          }
        } catch (err) {
          console.error('Could not fetch JEE progress', err);
        }
      }
    };
    fetchProgress();
  }, [token]);

  // SAVE progress function
  const saveProgress = async (newJeeProgress) => {
    if (token) {
      try {
        const config = { headers: { 'x-auth-token': token } };
        // Send the progress nested under a 'jee' key
        await axios.put('https://syllabus-tracker-backend-7w7a.onrender.com/api/progress', { jee: newJeeProgress }, config);
        console.log('JEE Progress saved!');
      } catch (err) {
        console.error('Could not save JEE progress', err);
      }
    }
  };

  // UPDATE toggleTopic to save after changing state
  const toggleTopic = (topicName) => {
    const newCompletedTopics = {
      ...completedTopics,
      [topicName]: !completedTopics[topicName],
    };
    setCompletedTopics(newCompletedTopics);
    saveProgress(newCompletedTopics); // Call save function
  };

  const currentSyllabus = useMemo(() => {
    return jeeSyllabus.find(subject => subject.category === openSubject)?.subCategories || [];
  }, [openSubject]);

  const allTopicsForCurrentSubject = useMemo(() => {
    const topics = new Set();
    currentSyllabus.forEach(sub => {
      if (sub.topics) sub.topics.forEach(t => topics.add(t));
    });
    return Array.from(topics);
  }, [currentSyllabus]);
  
  const totalTopics = allTopicsForCurrentSubject.length;
  const completedCount = allTopicsForCurrentSubject.filter(topic => completedTopics[topic]).length;

  const handleSubjectClick = (subjectName) => {
    setOpenSubject(prev => (prev === subjectName ? null : subjectName));
    setOpenCategories([]);
  };

  const toggleCategory = (categoryName) => {
    setOpenCategories(prev => 
      prev.includes(categoryName) ? prev.filter(cat => cat !== categoryName) : [...prev, categoryName]
    );
  };

  return (
    <div className="jee-container">
      <h1>🚀 JEE Syllabus Tracker</h1>
      <ProgressBar completed={completedCount} total={totalTopics > 0 ? totalTopics : 1} />

      <div className="subjects-list">
        {jeeSyllabus.map(subject => (
          <div key={subject.category} className="subject-accordion">
            <button className={`accordion-header ${openSubject === subject.category ? 'active' : ''}`} onClick={() => handleSubjectClick(subject.category)}>
              {subject.category}
              <span className="accordion-icon">{openSubject === subject.category ? '−' : '+'}</span>
            </button>
            
            {openSubject === subject.category && (
              <div className="accordion-content">
                {subject.subCategories.map(subCategory => (
                  <div key={subCategory.name} className="category-accordion">
                    <button className="category-header" onClick={() => toggleCategory(subCategory.name)}>
                      {subCategory.name}
                      <span className="category-icon">{openCategories.includes(subCategory.name) ? '−' : '+'}</span>
                    </button>
                    
                    {openCategories.includes(subCategory.name) && (
                      <div className="category-content">
                        <ul className="topic-list">
                          {subCategory.topics.map(topic => (
                            <li key={topic}>
                              <label className={`topic-item-list ${completedTopics[topic] ? 'completed' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={!!completedTopics[topic]}
                                  onChange={() => toggleTopic(topic)}
                                />
                                <span className="custom-checkbox"></span>
                                <span className="topic-text">{topic}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JEEPage;
