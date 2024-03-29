const express = require('express');
const app = express();

const cors = require('cors'); 

app.use(cors());
app.use(express.json()); 
require('./data/db')

app.get('/', (req, res) => {
  res.send('Hello')
});
const Patient = require('./Models/PatientModel');
const Ward = require('./Models/WardModel');



app.post('/patients', async (req, res) => {
  const inputData = req.body;

  if (!inputData.name || !inputData.age || !inputData.gender) {
    return res.status(400).json({ error: 'Name, age, and gender are required fields.' });
  }

  try {
    const ward = await Ward.findById(inputData.assignedWard);
    if (!ward) {
      return res.status(404).json({ error: 'Ward not found' });
    }

    const newPatient = new Patient(inputData);
    newPatient.assignedWard = ward; // Assign the ward object to the patient's assignedWard field

    const savedPatient = await newPatient.save();
    const populatedSavedPatient = await Patient.findById(savedPatient._id).populate('assignedWard');

    res.status(201).json({ success: true, data: populatedSavedPatient });
  } catch (error) {
    console.error('Error adding patient:', error.message);
    res.status(500).json({ error: 'Error adding patient' });
  }
});



// Get all patients
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find().populate('assignedWard');

    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    res.status(500).json({ error: 'Error fetching patients' });
  }
});

// Delete a patient by ID
app.delete('/patients/:id', async (req, res) => {
  const patientId = req.params.id;

  try {
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await Patient.deleteOne({_id: patientId});

    res.status(200).json({ success: true, data: patient, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error.message);
    res.status(500).json({ error: 'Error deleting patient' });
  }
});

// Update a patient
app.post('/patients/:id', async (req, res) => {
  const patientId = req.params.id;
  const patientData = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(patientId, patientData, { new: true });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json({ success: true, data: patient, message: 'Patient updated successfully' });
  } catch (error) {
    console.error('Error updating patient:', error.message);
    res.status(500).json({ error: 'Error updating patient' });
  }
});

// Add new ward
app.post('/wards', async (req, res) => {
  const inputData = req.body;

  if (!inputData.wardNumber || !inputData.capacity || !inputData.specializations) {
    return res.status(400).json({ error: 'Ward number, capacity, and specializations are required fields.' });
  }

  try {
    const newWard = new Ward(inputData);
    const savedWard = await newWard.save();

    res.status(201).json({ success: true, data: savedWard });
  } catch (error) {
    console.error('Error adding ward:', error.message);
    res.status(500).json({ error: 'Error adding ward' });
  }
});

// Get all wards
app.get('/wards', async (req, res) => {
  try {
    const wards = await Ward.find();

    res.status(200).json({ success: true, data: wards });
  } catch (error) {
    console.error('Error fetching wards:', error.message);
    res.status(500).json({ error: 'Error fetching wards' });
  }
});

// Delete a ward by ID
app.delete('/wards/:id', async (req, res) => {
  const wardId = req.params.id;

  try {
    const ward = await Ward.findById(wardId);

    if (!ward) {
      return res.status(404).json({ error: 'Ward not found' });
    }

    await Ward.deleteOne({_id:wardId});

    res.status(200).json({ success: true, data: ward, message: 'Ward deleted successfully' });
  } catch (error) {
    console.error('Error deleting ward:', error.message);
    res.status(500).json({ error: 'Error deleting ward' });
  }
});

// Update a ward
app.post('/wards/:id', async (req, res) => {
  const wardId = req.params.id;
  const wardData = req.body;

  try {
    const ward = await Ward.findByIdAndUpdate(wardId, wardData, { new: true });

    if (!ward) {
      return res.status(404).json({ error: 'Ward not found' });
    }

    res.status(200).json({ success: true, data: ward, message: 'Ward updated successfully' });
  } catch (error) {
    console.error('Error updating ward:', error.message);
    res.status(500).json({ error: 'Error updating ward' });
  }
});

const PORT = process.env.PORT || 9002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
