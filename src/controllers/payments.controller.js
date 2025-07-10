const Payment = require('../models/payment.model');

// GET all
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ receivedAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one by refNo
exports.getPaymentByRefNo = async (req, res) => {
  try {
    const payment = await Payment.findOne({ refNo: req.params.refNo });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST new payment
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const updated = await Payment.findOneAndUpdate(
      { refNo: req.params.refNo },
      { status: req.body.status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Payment not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
