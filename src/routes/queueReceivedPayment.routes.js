const express = require('express');
const router = express.Router();
const controller = require('../controllers/queueReceivedPayments.controller');

// GET all received payments
router.get('/', controller.getAllReceivedPayments);

// GET one by refNo
router.get('/:refNo', controller.getReceivedPaymentByRefNo);

// POST new payment (from Android app)
router.post('/', controller.createReceivedPayment);

// DELETE by ID (manual cleanup - optional)
router.delete('/:id', controller.deleteReceivedPayment);

module.exports = router;


// Method	Route	                                    Purpose
// GET	    /queue/received-payments	                all received UPI payments (TTL)
// GET	    /queue/received-payments/:refNo	            Get one received payment by Ref No
// POST	    /queue/received-payments	                Insert new UPI SMS payment from Android
// DELETE	/queue/received-payments/:id	            Manually delete a payment