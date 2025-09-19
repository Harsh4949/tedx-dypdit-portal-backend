
const Student = require('../models/student.model');

// GET all

exports.getAllStudents = async (req, res) => {
  try {

    const students = await Student.find().sort({ 'ticket.issuedAt': -1 });
    res.status(200).json(students);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET one by ID
exports.getStudentById = async (req, res) => {

  try {
    const student = await Student.findById(req.params.id);

    if (!student) return
        res.status(404).json({ error: 'Not found' });

    res.status(200).json(student);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST new verified student
exports.createStudent = async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update (ticket status, attendance, etc.)
exports.updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE student
exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) 
        return res.status(404).json({ error: 'Not found' });

    res.status(200).json({ message: 'Deleted successfully' });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET student by ticket number
exports.getStudentByTicketNumber = async (req, res) => {
  try {
    const student = await Student.findOne({ 'ticket.number': req.params.ticketNumber });
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark Present by Ticket Number
exports.markPresent = async (req, res) => {
  try {
    const { ticketNumber } = req.params;   // coming from scanner
    const { verifiedBy } = req.body;       // name of verifier (e.g., from req.user or body)

    // Find the student by ticket number
    const student = await Student.findOne({ 'ticket.number': ticketNumber })
      .populate('groupMembers'); // include group members if any

    if (!student) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // If already marked present, prevent duplicate scans
    if (student.present) {
      return res.status(400).json({ error: 'Already marked present' });
    }

    // Mark the main student
    student.present = true;
    student.presentyVerifiedBy = verifiedBy;
    await student.save();

    // If group ticket (duo/trio), mark members too
    if (student.participationType !== 'solo' && student.groupMembers.length > 0) {
      await Student.updateMany(
        { _id: { $in: student.groupMembers } },
        { $set: { present: true, presentyVerifiedBy: verifiedBy } }
      );
    }

    res.status(200).json({
      message: `${student.participationType} attendance marked successfully`,
      student
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
