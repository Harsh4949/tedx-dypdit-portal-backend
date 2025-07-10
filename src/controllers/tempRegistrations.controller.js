const TempRegistration = require('../models/tempRegistration.model');

// Get all
exports.getAllTempRegistrations = async (req, res) => {
  try {
    const data = await TempRegistration.find().sort({ submittedAt: -1 });
    res.status(200).json(data);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one by ID
exports.getTempRegistrationById = async (req, res) => {
  try {
    const temp = await TempRegistration.findById(req.params.id);
    if (!temp) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(temp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new
exports.createTempRegistration = async (req, res) => {
  try {
    const newEntry = await TempRegistration.create(req.body);
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update existing (status/remarks)
exports.updateTempRegistration = async (req, res) => {
  try {
    const updated = await TempRegistration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete one
exports.deleteTempRegistration = async (req, res) => {
  try {
    const deleted = await TempRegistration.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
