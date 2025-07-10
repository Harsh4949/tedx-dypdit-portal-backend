const express = require('express');
const connectDB = require('./config/db'); // make sure path is correct
require('dotenv').config();
const cors = require('cors');
const tempRegistrationRoutes = require('./routes/tempRegistrations.routes');
const queueSubmittedRoutes = require('./routes/queueSubmitted.routes');

const app = express();
app.use(express.json());
connectDB();

app.use(cors({
  origin: '*', // Allow all origins, adjust as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
}));






app.use('/temp-registrations', tempRegistrationRoutes);
app.use('/queue-submitted', queueSubmittedRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Server is running... Tedx</h1>');
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
