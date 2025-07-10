const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments.controller');


router.get('/', paymentController.getAllPayments);
router.get('/:refNo', paymentController.getPaymentByRefNo);
router.post('/', paymentController.createPayment);
router.put('/:refNo/status', paymentController.updatePaymentStatus);

module.exports = router;


// Method	 Route	                        Purpose
// GET	    /payments	                    Fetch all payments
// GET	    /payments/:refNo	            Fetch payment by UPI reference number
// POST	    /payments	                    Add a new verified payment (from backend) after verification done in PaymentReceved queue
// PUT	    /payments/:refNo/status	        Update status to valid/duplicate/unmatched