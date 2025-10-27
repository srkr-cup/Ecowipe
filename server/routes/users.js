const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  const user = new User({
    email: req.body.email,
    full_name: req.body.full_name,
    role: req.body.role
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.email) user.email = req.body.email;
    if (req.body.full_name) user.full_name = req.body.full_name;
    if (req.body.role) user.role = req.body.role;
    if (req.body.total_eco_points) user.total_eco_points = req.body.total_eco_points;
    if (req.body.total_devices_wiped) user.total_devices_wiped = req.body.total_devices_wiped;
    if (req.body.total_data_wiped_gb) user.total_data_wiped_gb = req.body.total_data_wiped_gb;
    if (req.body.eco_badges) user.eco_badges = req.body.eco_badges;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;