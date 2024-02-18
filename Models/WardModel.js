const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardNumber: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  specializations: {
    type: String,
    enum: ['Pediatrics', 'Surgery', 'ICU', 'Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Other'],
  },
});

const Ward = mongoose.model('Ward', wardSchema);
module.exports = Ward;
