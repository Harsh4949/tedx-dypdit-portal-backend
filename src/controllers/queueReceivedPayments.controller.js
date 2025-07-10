const QueueReceivedPayment = require('../models/queueReceivedPayment.model');

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
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new
exports.createReceivedPayment = async (req, res) => {
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours TTL
    const entry = await QueueReceivedPayment.create({ ...req.body, expiresAt });
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete by ID
exports.deleteReceivedPayment = async (req, res) => {
  try {
    const deleted = await QueueReceivedPayment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
