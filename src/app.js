const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// This code initializes an Express application, connects to a MongoDB database using a configuration file, and sets up a basic route that responds with a message when accessed. The server listens on a specified port, defaulting to 5000 if no environment variable is set.
// It also includes error handling for the database connection, ensuring that the application exits if the connection fails.