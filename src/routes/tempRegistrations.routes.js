const express = require('express');
const router = express.Router();

const tempRegistrationController = require('../controllers/tempRegistrations.controller');

router.get('/', tempRegistrationController.getAllTempRegistrations);
router.get('/:id', tempRegistrationController.getTempRegistrationById);
router.post('/', tempRegistrationController.createTempRegistration);
router.put('/:id', tempRegistrationController.updateTempRegistration);
router.delete('/:id', tempRegistrationController.deleteTempRegistration);

module.exports = router;


// 🔹 TempRegistrations (unverified students) routes

// Method	  Route	                      Purpose
// GET	    /temp-registrations		    Get all pending registrations
// GET      /temp-registrations/:id		Get a specific temp registration
// POST     /temp-registrations		    Add new temp registration manually
// PUT	    /temp-registrations/:id		Update status/remarks (admin)
// DELETE	/temp-registrations/:id		Remove unverified entry (optional)