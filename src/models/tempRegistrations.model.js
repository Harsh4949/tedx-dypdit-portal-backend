const mongoose = require('mongoose');

const tempRegistrationSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Types.ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    college: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    participationType: {
        type: String,
        enum: ['solo', 'duo', 'tro'],
        required: true
    },

    groupMembers: [{
        type: mongoose.Types.ObjectId,
        ref: 'TempRegistration'
    }],

    paymentScreenshotURL: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    submittedRefNo: {
        type: String,
        default: null,
        trim: true
    },

}, {
  timestamps: true,
  collection: 'TempRegistrations'
});

const TempRegistration = mongoose.model('TempRegistration', tempRegistrationSchema);

module.exports = TempRegistration;
