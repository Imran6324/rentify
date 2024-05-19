// models/Property.js
const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: String,
  location: String,
  area: Number,
  bedrooms: Number,
  bathrooms: Number,
  nearbyHospitals: [String],
  nearbyColleges: [String],
  rentPrice: Number,
  description: String,
  images: [String],
  sellerId: mongoose.Schema.Types.ObjectId,
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Property', PropertySchema);

