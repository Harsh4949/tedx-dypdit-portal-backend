const express = require('express');
const router = express.Router();
const studentController = require('../controllers/students.controller');


router.get('/', studentController.getAllStudents);
// router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
// router.put('/:id', studentController.updateStudent);
// router.delete('/:id', studentController.deleteStudent);
router.get('/:ticketNumber', studentController.getStudentByTicketNumber);
router.put('/mark-present/:ticketNumber', studentController.markPresent);


module.exports = router;


// Method   	  Route	            Purpose
// GET	        /students	        Get all verified participants
// GET  	    /students/:id	    Get a specific student
// POST	        /students	        Add a new student (after payment match)
// PUT	        /students/:id	    Update ticket, mark as present, etc.
// DELETE	    /students/:id	    Remove student (optional - admin only)