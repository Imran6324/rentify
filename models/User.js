// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  userType: { type: String, enum: ['buyer', 'seller'] }
});

module.exports = mongoose.model('User', UserSchema);
