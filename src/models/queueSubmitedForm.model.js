const mongoose = require('mongoose');

const queueSubmittedFormSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Types.ObjectId,
        auto: true
    },
    refNo: {
        type: String,
        required: true,
        trim: true
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
    type: {
        type: String,
        enum: ['solo', 'duo', 'trio'],
        required: true
    },
    groupMembers: [{
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
        }
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
    expiresAt: {
        type: Date,
        required: true
    }

}, {
    timestamps: true,
    collection: 'QueueSubmittedForms'
});

// Index to automatically add Entry in TempRegistration after 24 hours
queueSubmittedFormSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const QueueSubmittedForm = mongoose.model('QueueSubmittedForm', queueSubmittedFormSchema);

module.exports = QueueSubmittedForm;


//FrontEnd code to create a new QueueSubmittedForm entry
// const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours later

// await QueueSubmittedForm.create({
//   refNo,
//   name,
//   email,
//   contact,
//   college,
//   department,
//   type,
//   paymentScreenshotURL,
//   submittedAt: new Date(),
//   expiresAt
// });

// chage payment status to 'pending' in TempRegistration