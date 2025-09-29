const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// GET /api/progress (This route is fine, no changes needed)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('progress');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.progress || {}); // Send empty object if no progress
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/progress (This is the updated part)
router.put('/', auth, async (req, res) => {
  try {
    // req.body will be an object like { ssc: { ... } } or { jee: { ... } }
    const newProgressPortion = req.body;

    // Find the user first
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Merge the new progress with the existing progress
    const updatedProgress = { ...user.progress, ...newProgressPortion };

    // Update the user's progress field and save
    user.progress = updatedProgress;
    await user.save();

    res.json(user.progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;