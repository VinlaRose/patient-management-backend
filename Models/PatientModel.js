const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  medicalHistory: {
    conditions: [String],
    surgeries: [String],
    allergies: [String],
    medications: [String],
  },
  contactInformation: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    phoneNumber: String,
    emailAddress: String,
  },
  assignedWard:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ward',
      required: true,
    },

  
  
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
