const QueueSubmittedForm = require('../models/queueSubmitedForm.model');
const verifyAndProcessPayment = require('../utils/verifyAndProcessPayment');

// Get all
exports.getAllQueueForms = async (req, res) => {
    
  try {
    const forms = await QueueSubmittedForm.find().sort({ submittedAt: -1 });
    res.status(200).json(forms);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};

// Get one by ID
exports.getQueueFormById = async (req, res) => {

  try {
    const form = await QueueSubmittedForm.findById(req.params.id);

    if (!form) return 
        res.status(404).json({ error: 'Not found' });

    res.status(200).json(form);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new
exports.createQueueForm = async (req, res) => {

  try { 

   const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hrs from now
   //const expiresAt = new Date(Date.now() + 4 * 60 * 1000);
   
    const formData = { ...req.body, expiresAt };
    const newForm = await QueueSubmittedForm.create(formData);

    res.status(201).json(newForm);

    //  Background process (no res)
    verifyAndProcessPayment(newForm.refNo)
      .catch(err => console.error('Error in background process:', err));

  } catch (err) {
    res.status(400).json({ error: err.message });
    console.error("❌ Failed to insert:", err.message);
  }
};

// Delete one

exports.deleteQueueForm = async (req, res) => {

  try {
    const deleted = await QueueSubmittedForm.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
};
