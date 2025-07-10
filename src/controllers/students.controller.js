
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
