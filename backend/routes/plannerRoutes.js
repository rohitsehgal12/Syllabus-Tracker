const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// @route   GET /api/planner
// @desc    Get all planner data (routine and completions) for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      routineTasks: user.routineTasks,
      dailyCompletions: user.dailyCompletions,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/planner/routine
// @desc    Add a new task to the user's daily routine
// @access  Private
router.post('/routine', auth, async (req, res) => {
  const { text } = req.body;
  const newTask = {
    id: Date.now(), // Use timestamp for a unique ID
    text,
  };

  try {
    const user = await User.findById(req.user.id);
    user.routineTasks.push(newTask);
    await user.save();
    res.json(user.routineTasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/planner/routine/:id
// @desc    Delete a task from the user's daily routine
// @access  Private
router.delete('/routine/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.routineTasks = user.routineTasks.filter(
      (task) => task.id !== Number(req.params.id)
    );
    await user.save();
    res.json(user.routineTasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/planner/completions
// @desc    Update the completed tasks for a specific day
// @access  Private
router.put('/completions', auth, async (req, res) => {
  const { dateKey, completedIds } = req.body; // e.g., dateKey: "2025-09-30", completedIds: [1, 3]

  try {
    const user = await User.findById(req.user.id);
    user.dailyCompletions.set(dateKey, completedIds);
    await user.save();
    res.json(user.dailyCompletions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;