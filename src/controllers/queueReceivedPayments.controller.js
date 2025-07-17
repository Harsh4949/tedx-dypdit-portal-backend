const QueueReceivedPayment = require('../models/queueReceivedPayment.model');
const verifyAndProcessPayment = require('../utils/verifyAndProcessPayment');

// Get all
exports.getAllReceivedPayments = async (req, res) => {
  try {
    const data = await QueueReceivedPayment.find().sort({ receivedAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one by refNo
exports.getReceivedPaymentByRefNo = async (req, res) => {
  try {
    const result = await QueueReceivedPayment.findOne({ refNo: req.params.refNo });
    if (!result) 
      return res.status(404).json({ error: 'Not found' });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new
exports.createReceivedPayment = async (req, res) => {
  try {
    
    // Fix mismatched keys
    const payload = {
      refNo: req.body.refNo,
      amount: req.body.amount,
      bankName: req.body.bankName,
      ServerHolderName: req.body.serverHolder, //  convert key
      receivedAt: new Date(req.body.timeReceived), //  convert to Date
    };

    const entry = await QueueReceivedPayment.create(payload);
    res.status(201).json(entry);

    // Trigger verification after creation
    verifyAndProcessPayment(entry.refNo)
      .catch(err => console.error('Error in background process:', err));

  } catch (err) {
    console.error("❌ Failed to insert:", err.message);
    res.status(400).json({ error: err.message });
  }
};


// Delete by ID
exports.deleteReceivedPayment = async (req, res) => {
  try {
    const deleted = await QueueReceivedPayment.findByIdAndDelete(req.params.id);
    
    if (!deleted) 
      return res.status(404).json({ error: 'Not found' });

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
