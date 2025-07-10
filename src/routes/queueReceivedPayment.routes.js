const express = require('express');
const router = express.Router();
const controller = require('../controllers/queueReceivedPayments.controller');


router.get('/', controller.getAllReceivedPayments);
router.get('/:refNo', controller.getReceivedPaymentByRefNo);

// POST new payment (from Android app)
router.post('/', controller.createReceivedPayment);
router.delete('/:id', controller.deleteReceivedPayment);

module.exports = router;


// Method	Route	                                    Purpose
// GET	    /queue/received-payments	                all received UPI payments
// GET	    /queue/received-payments/:refNo	            Get one received payment by Ref No
// POST	    /queue/received-payments	                Insert new UPI SMS payment from Android
// DELETE	/queue/received-payments/:id	            Manually delete a payment
