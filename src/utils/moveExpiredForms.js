const QueueSubmittedForm = require('../models/queueSubmitedForm.model');
const TempRegistration = require('../models/tempRegistration.model');

const moveExpiredForms = async () => {
  try {
    const now = new Date();
    const aboutToExpireForms = await QueueSubmittedForm.find({
      expiresAt: { $lte: now }
    });

    for (const form of aboutToExpireForms) {
      // Construct temp registration object
      const tempData = {
        name: form.name,
        email: form.email,
        contact: form.contact,
        college: form.college,
        department: form.department,
        participationType: form.type,
        groupMembers: form.groupMembers,
        paymentScreenshotURL: form.paymentScreenshotURL,
        submittedRefNo: form.refNo,
        submittedAt: form.submittedAt,
        paymentStatus: "pending"
      };

      // Insert into TempRegistration
      await TempRegistration.create(tempData);

      // Delete original to avoid TTL race
      await QueueSubmittedForm.findByIdAndDelete(form._id);
    }

    if (aboutToExpireForms.length)
      console.log(`🕒 Moved ${aboutToExpireForms.length} expired forms to TempRegistration`);

  } catch (error) {
    console.error("❌ Error moving expired forms:", error.message);
  }
};

module.exports = moveExpiredForms;
