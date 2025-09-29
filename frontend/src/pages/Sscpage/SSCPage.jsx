import React, { useState, useMemo, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import './SSCPage.css';

// --- Syllabus Data...
const quantSyllabus = [ { category: 'Basic Maths', topics: [ 'Percentage / प्रतिशत', 'Profit and loss / लाभ और हानि', 'Simple and Compound Interest / साधारण और चक्रवृद्धि ब्याज', 'Ratio and Proportion / अनुपात और समानuपात', 'Mixture and Alligation / मिश्रण और गठबंधन', 'Partnership / साझेदारी', 'Age Based / आयु आधारित', 'Average / औसत', 'Time and Work / समय और कार्य', 'Work and Wages / कार्य और मजबूरी', 'Pipes and Cistern / पाइप और हौज', 'Time, speed and distance / समय, गति और दूरी', 'Boats and Stream / नाव और धारा', 'Train / ट्रेन', 'Race / दौड़', 'Data Interpretation / डेटा व्याख्या' ] }, { category: 'Advance Maths', subCategories: [ { name: 'Number System (संख्या प्रणाली)', topics: [ 'Number of Zeroes / शून्य की संख्या', 'Remainder Theorem / शेष प्रमेय', 'Binomial Theorem / द्विपद प्रमेव', 'Unit Place digit / इकाई स्थान अंक', 'Last two/Three digit / अंतिम दो/तीन अंक', 'Surds and Indices / करणी और सूचकांक', 'Square and roots / वर्ग और मूल', 'Fractions / भिन्न', 'Factors / कारक', 'Divisibility based / विभाज्यता आधारित', 'AP/GP/HP', 'V-BODMAS', 'LCM/HCF' ] }, { name: 'Algebra (बीजगणित)', topics: ['10 types Questions / 10 प्रकार के प्रश्न'] }, { name: 'Mensuration (क्षेत्रमिति)', topics: ['2D', '3D', 'Prism/Pyramid/Tetrahedron'] }, { name: 'Geometry (ज्यामिति)', topics: ['Lines and Angles / रेखाएं और कोण', 'Triangles / त्रिभुज', 'Quadrilateral / चतुर्भुज', 'Circle / वृत्त', 'Polygon / बहुभुज','Height and distance / ऊंचाई और दूरी'] }, { name: 'Trigonometry (त्रिकोणमिति)', topics: ['Trigonometry (त्रिकोणमिति)'] }, { name: 'Quadratic Equation', topics: ['Quadratic Equation'] }, { name: 'Co-ordinate Geometry (निर्देशांक ज्यामिति)', topics: ['Co-ordinate Geometry'] } ] } ];
const reasoningSyllabus = [ { category: 'Verbal Reasoning', topics: [ 'Coding - Decoding / कोडिंग-डिकोडिंग', 'Pair Formation / युग्म गठन', 'Letter Series / अक्षर श्रृंखला', 'Alphabetical Series / वर्णमाला श्रृंखला', 'Word Formation / शब्द गठन', 'Dictionary / शब्दकोश', 'Jumbling / अक्षरों का तार्किक क्रम', 'Number Series / संख्या श्रृंखला', 'Missing Number / लुप्त संख्याएँ', 'Analogy or Similarity / सादृश्यता परीक्षण', 'Odd One Out (Classification) / वर्गीकरण', 'Coded Equation / गणितीय समीकरण', 'Dice / पासा', 'Cube and Cuboid / घन और घनाभ', 'Counting Figures / आकृतियों की गणना', 'Blood Relation / रक्त संबंध', 'Calendar / कैलेंडर', 'Clock / घड़ी', 'Direction and Distance / दिशा और दूरी परीक्षण', 'Syllogism / न्याय निगमन', 'Ranking Test / क्रम व्यवस्था परीक्षण', 'Seating Arrangement / बैठने की व्यवस्था', 'Puzzle / पहेली', 'Venn-Diagram / वेन आरेख', 'Inequality / असमानताएं', 'Machine Input-Output / मशीन इनपुट-आउटपुट', 'Statement - Arguments / कथन और तर्क', 'Statement - Assumptions / कथन और पूर्वधारणा', 'Statement - Conclusions / कथन और निष्कर्ष', 'Statement - Courses of Action / कथन और कार्यवाही', 'Cause and Effect / कारण और परिणाम', 'Assertion and Reason / अभिकथन और कारण', 'Decision Making / निर्णय लेना', 'Data Sufficiency / आँकड़े पर्याप्तता', 'Word-Based Problems / शब्दों पर आधारित प्रश्न', 'Matrix / आव्यूह' ] }, { category: 'Non-Verbal Reasoning', topics: [ 'Mirror and Water Images / दर्पण और क्षैतिज प्रतिबिंब', 'Paper Folding and Cutting / कागज मोड़ना एवं काटना', 'Embedded Figure / छिपी हुई आकृति पता लगाना', 'Completion of Figure / आकृतियों को पूरा करना', 'Grouping of Figures / एक जैसी आकृतियों का समूह', 'Series / आकृतियों की श्रृंखला', 'Analogy / आकृतियों की सादृश्यता', 'Classification / आकृतियों का वर्गीकरण', 'Dot Situation / बिंदु स्थापना', 'Figure Formation / आकृतियों को जोड़ना' ] } ];
const englishSyllabus = [ { category: 'Vocabulary', topics: [ 'Synonyms', 'Antonyms', 'One Word Substitution', 'Idioms and Phrases', 'Spelling Test / Spelling Errors', 'Word Meaning in Context' ] }, { category: 'Grammar', topics: [ 'Basic Concept', 'Verb', 'Tense', 'Types of Sentence', 'Question Tag', 'Conditional Sentence', 'Subject Verb Agreement / Syntax', 'Causative Verb', 'Mood', 'Inversion', 'Infinitive', 'Gerund', 'Participle', 'Passive Voice', 'Narration', 'Noun', 'Pronoun', 'Adjective', 'Adverb', 'Article', 'Determiners', 'Parallelism', 'Preposition', 'Phrasal Verb', 'Conjunction', 'Modals', 'Identifying Parts of Speech', 'Superfluous Expressions', 'Spellings', 'Proverbs', 'Legal Terms' ] }, { category: 'Comprehension', topics: [ 'Reading Comprehension', 'Cloze Test', 'Para Jumble / Sentence Arrangement (PQRS)', 'Sentence Completion / Contextual Fill in the Blanks', 'Passage-based Vocabulary' ] } ];
const generalAwarenessSyllabus = [ { category: 'History', subCategories: [ { name: 'Ancient History', topics: [ 'Indus Valley Civilization', 'Vedic Civilization', 'Mahajanapadas', 'Jainism', 'Buddhism', 'Magadha Kingdom', 'Maurya Dynasty', 'Gupta Dynasty' ] }, { name: 'Medieval History', topics: [ 'Delhi Sultanate', 'Mughal Dynasty', 'Vijayanagar Empire', 'Foreign Invasions', 'Sikh Gurus', 'Wars and Treaties', 'Important Temples' ] }, { name: 'Modern History', topics: [ 'The Revolt of 1857', 'British Acts and Policies', 'Partition of Bengal and Swadeshi Movement', 'Gandhian Era (1915-1947)', 'Socio-Religious Reforms', 'Indian National Congress', 'The Revolutionaries', 'Books and Letters (Freedom Struggle)', 'Governors and Viceroys' ] } ] }, { category: 'Polity', topics: [ 'Articles, Schedules, Parts and Lists', 'Amendments', 'Fundamental Rights and Duties', 'Parliament', 'PM, President, Vice-President', 'Government Bodies', 'Sources of Indian Constitution', 'Committee Reports', 'High Court & Supreme Court Articles' ] }, { category: 'Geography', topics: [ 'Physiographic Division of India', 'Agriculture, Soil, Vegetation', 'Climate (Seasons, Monsoon)', 'Structure of Earth (Plate Theory)', 'Winds', 'Indian Drainage System', 'Biosphere Reserves', 'Mountains', 'Solar System', 'Continents and Oceans' ] }, { category: 'General Science', subCategories: [ { name: 'Biology', topics: [ 'Nutrition in Animals and Plants', 'Deficiency and Diseases', 'Cell/Cell Division', 'Enzymes & Hormones', 'Circulatory System', 'Discoveries and Vaccines', 'Plant Kingdom', 'Digestive System', 'Animal Kingdom', 'Microorganisms' ] }, { name: 'Physics', topics: [ 'Units & Measurements', 'Light & Optics', 'Electric Current & its Effects', 'Discoveries', 'Force & Pressure' ] }, { name: 'Chemistry', topics: [ 'Chemistry in Everyday Life', 'Periodic Table', 'Metals, Non-metals, Alloys', 'Common Names', 'Structure of Atom', 'Acid, Base and Salt' ] } ] }, { category: 'Static GK', subCategories: [ { name: 'General', topics: [ 'History Important Dates', 'Festivals and Related States', 'Soil', 'Lakes (Indian & World)', 'Books & Authors', 'First Indian (Male/Female)', 'Important Dates (World/Indian)', 'Folk Dance and Related States', 'Religious Places', 'Organisations (H/Q)', 'Scientific Instruments', 'National Parks / Wildlife Sanctuaries', 'Dynasties (Founder/Capital)', 'Famous Personalities', 'Dams and Reservoirs', 'Mountain Passes', 'List of Indian Cities on River Banks' ] }, { name: 'Art & Culture', topics: [ 'Folk Dances of India', 'Classical Dances of India', 'Fairs and Festivals of India', 'New Year Festivals of India', 'Martial Arts of India', 'Musical Instruments and Gharanas' ] } ] }, { category: 'Current Affairs', topics: [ 'Awards', 'MoUs / Agreements', 'Appointments', 'Sports (Year-wise)', 'Defence Affairs (Exercises)', 'Important Schemes (Central Government)', 'Important Schemes (State Government)', 'Ranks and Reports', 'National Affairs', 'International Affairs', 'State Affairs', 'Summits and Conferences', 'Important Days and Themes', 'Books and Authors' ] }, { category: 'Economy', topics: [ 'Indian Economy', 'Budget', 'Taxation and Policies', 'Economy of Neighbouring Countries', 'Money and Banking', 'Production and Market', 'Miscellaneous' ] } ];
export const mainSubjects = [ { name: 'Quantitative Aptitude', details: quantSyllabus }, { name: 'Reasoning Ability', details: reasoningSyllabus }, { name: 'English Language', details: englishSyllabus }, { name: 'General Awareness', details: generalAwarenessSyllabus } ];

const SSCPage = () => {
  const [completedTopics, setCompletedTopics] = useState({});
  const [openSubject, setOpenSubject] = useState(null);
  const [openCategories, setOpenCategories] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProgress = async () => {
      if (token) {
        try {
          const config = { headers: { 'x-auth-token': token } };
          const res = await axios.get('https://syllabus-tracker-backend-7w7a.onrender.com/api/progress', config);
          // Set state from the 'ssc' key in the response
          if (res.data && res.data.ssc) {
            setCompletedTopics(res.data.ssc);
          }
        } catch (err) {
          console.error('Could not fetch progress', err);
        }
      }
    };
    fetchProgress();
  }, [token]);

  const saveProgress = async (newSscProgress) => {
    if (token) {
      try {
        const config = { headers: { 'x-auth-token': token } };
        // Send the progress nested under an 'ssc' key
        await axios.put('https://syllabus-tracker-backend-7w7a.onrender.com/api/progress', { ssc: newSscProgress }, config);
        console.log('SSC Progress saved!');
      } catch (err) {
        console.error('Could not save progress', err);
      }
    }
  };

  const toggleTopic = (topicName) => {
    const newCompletedTopics = {
      ...completedTopics,
      [topicName]: !completedTopics[topicName],
    };
    setCompletedTopics(newCompletedTopics);
    saveProgress(newCompletedTopics);
  };
  
  // --- The rest of the component is the same ---
  const currentSyllabus = useMemo(() => { return mainSubjects.find(subject => subject.name === openSubject)?.details || []; }, [openSubject]);
  const allTopicsForCurrentSubject = useMemo(() => { const topics = new Set(); currentSyllabus.forEach(section => { if (section.topics) section.topics.forEach(t => topics.add(t)); if (section.subCategories) { section.subCategories.forEach(sub => { if (sub.topics) sub.topics.forEach(t => topics.add(t)); }); } }); return Array.from(topics); }, [currentSyllabus]);
  const totalTopics = allTopicsForCurrentSubject.length;
  const completedCount = allTopicsForCurrentSubject.filter(topic => completedTopics[topic]).length;
  const handleSubjectClick = (subjectName) => { setOpenSubject(prev => (prev === subjectName ? null : subjectName)); setOpenCategories([]); };
  const toggleCategory = (categoryName) => { setOpenCategories(prev => prev.includes(categoryName) ? prev.filter(cat => cat !== categoryName) : [...prev, categoryName]); };

  return (
    <div className="ssc-container">
      <h1>🏛️ SSC Syllabus Tracker</h1>
      <ProgressBar completed={completedCount} total={totalTopics > 0 ? totalTopics : 1} />
      <div className="subjects-list">
        {mainSubjects.map(subject => (
          <div key={subject.name} className="subject-accordion">
            <button className={`accordion-header ${openSubject === subject.name ? 'active' : ''}`} onClick={() => handleSubjectClick(subject.name)}>
              {subject.name}
              <span className="accordion-icon">{openSubject === subject.name ? '−' : '+'}</span>
            </button>
            {openSubject === subject.name && (
              <div className="accordion-content">
                {subject.details ? (
                  subject.details.map(section => (
                    <div key={section.category} className="category-accordion">
                      <button className="category-header" onClick={() => toggleCategory(section.category)}>
                        {section.category}
                        <span className="category-icon">{openCategories.includes(section.category) ? '−' : '+'}</span>
                      </button>
                      {openCategories.includes(section.category) && (
                        <div className="category-content">
                          {section.topics && (
                             <ul className="topic-list">
                               {section.topics.map(topic => (
                                 <li key={topic}>
                                   <label className={`topic-item-list ${completedTopics[topic] ? 'completed' : ''}`}>
                                     <input type="checkbox" checked={!!completedTopics[topic]} onChange={() => toggleTopic(topic)} />
                                     <span className="custom-checkbox"></span>
                                     <span className="topic-text">{topic}</span>
                                   </label>
                                 </li>
                               ))}
                             </ul>
                           )}
                           {section.subCategories && section.subCategories.map(sub => (
                             <div key={sub.name} className="subcategory-section">
                               <h3 className="subcategory-title">{sub.name}</h3>
                               <ul className="topic-list">
                                 {sub.topics.map(topic => (
                                   <li key={topic}>
                                     <label className={`topic-item-list ${completedTopics[topic] ? 'completed' : ''}`}>
                                       <input type="checkbox" checked={!!completedTopics[topic]} onChange={() => toggleTopic(topic)} />
                                       <span className="custom-checkbox"></span>
                                       <span className="topic-text">{topic}</span>
                                     </label>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="placeholder-text">Syllabus for this section will be added soon.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SSCPage;
