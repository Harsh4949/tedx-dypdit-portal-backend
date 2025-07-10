const express = require('express');
const router = express.Router();

const controller = require('../controllers/queueSubmittedForms.controller');

router.get('/', controller.getAllQueueForms);
router.get('/:id', controller.getQueueFormById);
router.post('/', controller.createQueueForm);
router.delete('/:id', controller.deleteQueueForm);

module.exports = router;

// 🔹 QueueSubmittedForms routes

// GET    /queue-submitted       Get all submitted forms
// GET    /queue-submitted/:id   Get a specific submitted form
// POST   /queue-submitted       Create a new submitted form
// DELETE /queue-submitted/:id   Delete a submitted form