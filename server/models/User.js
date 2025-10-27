const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  full_name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  total_eco_points: {
    type: Number,
    default: 0
  },
  total_devices_wiped: {
    type: Number,
    default: 0
  },
  total_data_wiped_gb: {
    type: Number,
    default: 0
  },
  eco_badges: [{
    type: String,
    enum: ['GREEN_SHIELD', 'DATA_GUARDIAN', 'ECO_WARRIOR']
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);