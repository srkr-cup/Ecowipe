const express = require('express');
const router = express.Router();
const WipeRecord = require('../models/WipeRecord');
const User = require('../models/User');

// Get all wipe records
router.get('/', async (req, res) => {
  try {
    const wipeRecords = await WipeRecord.find().populate('user');
    res.json(wipeRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single wipe record
router.get('/:id', async (req, res) => {
  try {
    const wipeRecord = await WipeRecord.findById(req.params.id).populate('user');
    if (!wipeRecord) {
      return res.status(404).json({ message: 'Wipe record not found' });
    }
    res.json(wipeRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create wipe record
router.post('/', async (req, res) => {
  const wipeRecord = new WipeRecord({
    user: req.body.user_id,
    device_type: req.body.device_type,
    operating_system: req.body.operating_system,
    wipe_method: req.body.wipe_method,
    wipe_command: req.body.wipe_command,
    device_size_gb: req.body.device_size_gb
  });

  try {
    const newWipeRecord = await wipeRecord.save();
    
    // Update user statistics
    const user = await User.findById(req.body.user_id);
    user.total_devices_wiped += 1;
    user.total_data_wiped_gb += req.body.device_size_gb;
    user.total_eco_points += wipeRecord.eco_points;
    await user.save();

    res.status(201).json(newWipeRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update wipe record (for proof verification)
router.patch('/:id', async (req, res) => {
  try {
    const wipeRecord = await WipeRecord.findById(req.params.id);
    if (!wipeRecord) {
      return res.status(404).json({ message: 'Wipe record not found' });
    }

    if (req.body.proof_screenshot_url) {
      wipeRecord.proof_screenshot_url = req.body.proof_screenshot_url;
    }
    if (req.body.status) {
      wipeRecord.status = req.body.status;
    }
    if (req.body.verification_details) {
      wipeRecord.verification_details = req.body.verification_details;
      wipeRecord.verification_date = new Date();
    }

    const updatedWipeRecord = await wipeRecord.save();
    res.json(updatedWipeRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;