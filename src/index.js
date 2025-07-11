const express = require('express');
const connectDB = require('./config/db'); // make sure path is correct
require('dotenv').config();
const cors = require('cors');

const tempRegistrationRoutes = require('./routes/tempRegistrations.routes');
const queueSubmittedRoutes = require('./routes/queueSubmitedForm.routes');
const paymentRoutes = require('./routes/payments.routes'); 
const queueReceivedPaymentRoutes = require('./routes/queueReceivedPayment.routes'); 
const studentRoutes = require('./routes/students.routes');

const app = express();
app.use(express.json());
connectDB();

app.use(cors({
  origin: '*',        //Adjust this to your needs, e.g., specify allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));


// Define routes
app.use('/temp-registrations', tempRegistrationRoutes);
app.use('/queue-submitted-forms', queueSubmittedRoutes);
app.use('/payments', paymentRoutes);
app.use('/queue/received-payments', queueReceivedPaymentRoutes);
app.use('/students', studentRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});


const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
