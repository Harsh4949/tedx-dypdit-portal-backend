// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();

const moveExpiredForms = require('../utils/moveExpiredForms');

router.post('/move-expired', async (req, res) => {   
    try {
        await moveExpiredForms();
        res.status(200).send('Expired forms moved to TempRegistrations');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;


///move-expired - This route triggers the moveExpiredForms function to move expired forms from QueueSubmittedForms to TempRegistrations.
/// It can be called manually by the admin to ensure that expired forms are processed and moved as needed.