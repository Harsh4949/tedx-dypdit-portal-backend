const QueueReceivedPayment = require('../models/queueReceivedPayment.model');
const QueueSubmittedForm = require('../models/queueSubmitedForm.model');
const Payment = require('../models/payment.model');
const Student = require('../models/student.model');
const temRegistration = require('../models/tempRegistration.model');
const TicketPrice = require('./ticketPrice/ticketPrice'); 
const generateTicket = require('./ticketGenerator'); 
const sendMail = require('./sendTicketMail'); 

async function verifyAndProcessPayment(refNo) {
  try {

    // Check if payment exists
    const paymentData = await QueueReceivedPayment.findOne({ refNo });
    if (!paymentData) {
      console.log(`❌ No payment found for refNo ${refNo}`);
      return;
    }

    // Check if submitted form exists
    const formData = await QueueSubmittedForm.findOne({ refNo }).sort({ submittedAt: 1 });
    if (!formData ) {
      console.log(`❌ No form found for refNo ${refNo}`);
      return;
    }

    console.log(`✅ Match found for refNo ${refNo}`);

    // Check if payment already processed
    const existingPayment = await Payment.findOne({ refNo: paymentData.refNo });
    if (existingPayment) {
      console.log(`⚠️ Payment already processed for refNo ${refNo}`);
      await QueueSubmittedForm.deleteOne({ _id: formData._id });
      return;
    }

    // Validate payment amount
    const expectedAmount = TicketPrice[formData.type];
    if (paymentData.amount !== expectedAmount) {
      console.log(`❌ Invalid amount for refNo ${refNo}. Expected: ${expectedAmount}, Received: ${paymentData.amount}`);
      
      // Map QueueSubmittedForm data to TempRegistration schema
      const tempRegData = {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        college: formData.college,
        department: formData.department,
        participationType: formData.type ,
        groupMembers: formData.groupMembers || [],
        paymentScreenshotURL: formData.paymentScreenshotURL,
        submittedAt: formData.submittedAt,
        paymentStatus: 'unmatchAmount',
        submittedRefNo: formData.refNo
      };
      
      await temRegistration.create(tempRegData);
      await QueueSubmittedForm.deleteOne({ _id: formData._id });
      // await QueueReceivedPayment.deleteOne({ _id: paymentData._id });   // ❌commented for testing
      return;
    }

    // Create a new Payment entry
    const newPayment = await Payment.create({
      refNo: paymentData.refNo,
      paidBy: formData.name,
      participationType: formData.type,
      amount: Number(paymentData.amount),
      submittedAt: formData.submittedAt,
      paymentScreenshotURL: formData.paymentScreenshotURL,
      serverHolder: paymentData.ServerHolderName,
      status: 'valid'
    });

    // Generate tickets and insert students
    const studentDocs = [];
    const participants = [];

    // Solo participant
    participants.push({
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      college: formData.college,
      department: formData.department
    });

    // Duo / Trio members
    if (formData.groupMembers && formData.groupMembers.length > 0) {
      formData.groupMembers.forEach(member => participants.push(member));
    }

    for (let participant of participants) {
      const ticketNumber =  generateTicket(); 
      const student = await Student.create({
        name: participant.name,
        email: participant.email,
        contact: participant.contact,
        college: participant.college,
        department: participant.department,
        participationType: formData.type,
        ticket: {
          number: ticketNumber,
          issuedAt: new Date(),
          status: 'sent'
        },
        refNo: formData.refNo,
        paymentId: newPayment._id,
        paymentScreenshotURL: formData.paymentScreenshotURL
      });

      studentDocs.push(student);

      // Send ticket email
       await sendMail(student.email, 'TEDx Ticket', `Your ticket number is ${ticketNumber}`, ticketNumber, student.name, formData.type);
    }

    // Update Payment with student references and
    // Add references to all other group members in each Student doc
    await Payment.findByIdAndUpdate(newPayment._id, {linkedStudentIds: studentDocs.map(s => s._id)});
   
    const studentIds = studentDocs.map(s => s._id);
    await Promise.all(studentDocs.map(student => {
      const otherMembers = studentIds.filter(id => !id.equals(student._id));
      return Student.findByIdAndUpdate(student._id, { groupMembers: otherMembers });
    }));

    console.log(`✅ Inserted ${studentDocs.length} students & payment linked`);


    //  Remove from Queue collections
    await QueueSubmittedForm.deleteOne({ _id: formData._id });
    // await QueueReceivedPayment.deleteOne({ _id: paymentData._id });   //Removed for testing Uncommet it
    console.log(`🗑️ Removed refNo ${refNo} from QueueSubmittedForms & QueueReceivedPayments`);



  } catch (err) {
    console.error('❌ Error in verifyAndProcessPayment:', err.message);
  }
}

module.exports = verifyAndProcessPayment;
