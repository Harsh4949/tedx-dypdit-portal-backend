const mongoose = require('mongoose');

const queueReceivedPaymentSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Types.ObjectId,
        auto: true
    },
    refNo: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: String,
        required: true
    },
    ServerHolderName: {
        type: String,
        required: true,
        trim: true
    },
    bankName: {
        type: String,
        required: true,
        trim: true
    },
    receivedAt: {
        type: Date,
        required: true,
        default: Date.now
    }

}, {
    timestamps: true,
    collection: 'QueueReceivedPayments'
});

const QueueReceivedPayment = mongoose.model('QueueReceivedPayment', queueReceivedPaymentSchema);

module.exports = QueueReceivedPayment;



