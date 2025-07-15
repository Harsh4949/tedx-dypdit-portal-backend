const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

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
        enum: ['solo', 'duo', 'trio'],
        required: true
    },
    groupMembers: [{
        type: mongoose.Types.ObjectId,
        ref: 'Student'
    }],
    ticket: {
        number: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        issuedAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['sent', 'failed'],
            default: 'sent'
        }
    },
    refNo: {
        type: String,
        required: true,
        trim: true
    },
    present: {             
        type: Boolean,
        default: false
    },
    presentyVerifiedBy: {
        type: String,
        default: null
    },
    paymentId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Payment'
    },
    paymentScreenshotURL: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
    collection: 'Students'
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
