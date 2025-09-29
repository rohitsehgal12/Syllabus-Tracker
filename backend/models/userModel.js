const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  progress: {
    type: Object,
    default: {},
  },
  // --- ADD THESE NEW FIELDS ---
  routineTasks: {
    // This stores the template of daily tasks
    type: [{ id: Number, text: String }],
    default: [],
  },
  dailyCompletions: {
    // This stores which tasks were completed on which day
    // The key will be the date (e.g., "2025-09-30")
    // The value will be an array of completed task IDs
    type: Map,
    of: [Number],
    default: {},
  },
  // --- END OF NEW FIELDS ---
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;