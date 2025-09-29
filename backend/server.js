const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// This line handles login/registration
app.use('/api/users', require('./routes/userRoutes')); 

// --- THIS IS THE NEW LINE YOU NEED TO ADD ---
// This line handles getting/saving syllabus progress
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/planner', require('./routes/plannerRoutes'));

app.get('/', (req, res) => {
  res.send('✅ Backend server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});