const mongoose = require('mongoose');

const wipeRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  device_type: {
    type: String,
    required: true,
    enum: ['laptop', 'desktop', 'mobile', 'tablet', 'hdd', 'ssd', 'usb']
  },
  operating_system: {
    type: String,
    required: true,
    enum: ['windows', 'linux', 'macos', 'android', 'ios']
  },
  wipe_method: {
    type: String,
    required: true,
    enum: ['quick', 'deep', 'military']
  },
  wipe_command: {
    type: String,
    required: true
  },
  proof_screenshot_url: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'pending_proof', 'completed', 'failed'],
    default: 'pending'
  },
  eco_points: {
    type: Number,
    default: 0
  },
  device_size_gb: {
    type: Number,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  verification_date: {
    type: Date
  },
  verification_details: {
    success: Boolean,
    confidence: Number,
    matched_keywords: [String]
  }
});

// Calculate eco points before saving
wipeRecordSchema.pre('save', function(next) {
  // Base points based on wipe method
  let points = {
    quick: 50,
    deep: 75,
    military: 100
  }[this.wipe_method];

  // Bonus points based on device size
  points += Math.floor(this.device_size_gb / 100) * 10;

  this.eco_points = points;
  next();
});

module.exports = mongoose.model('WipeRecord', wipeRecordSchema);