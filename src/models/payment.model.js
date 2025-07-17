const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Types.ObjectId,
        auto: true
    },
    refNo: {
        type: String,
        required: true,
        trim: true,
        unique: true // Prevent duplicate UPI reference numbers
    },
    paidBy: {
        type: String,
        required: true,
        trim: true
    },
    participationType: {
        type: String,
        enum: ['solo', 'duo', 'trio'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    receivedAt: {
        type: Date,
        required: true,
        default: Date.now // When received on server
    },
    submittedAt: {
        type: Date,
        required: true // From registration form
    },
    paymentScreenshotURL: {
        type: String,
        required: true
    },
    serverHolder: {
        type: String,
        required: true,
        trim: true // GPay/PhonePe/Bank name
    },
    linkedStudentIds: [{
        type: mongoose.Types.ObjectId,
        ref: 'Student',
    }],
    status: {
        type: String,
        enum: ['valid', 'duplicate', 'unmatched'],
        default: 'valid'
    }

}, {
    timestamps: true,
    collection: 'Payments'
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
