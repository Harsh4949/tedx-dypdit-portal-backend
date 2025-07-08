require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Export the app for testing purposes
module.exports = app;


// The dotenv package is used to load environment variables from a .env file.
// Nodemon is used for development to automatically restart the server on file changes.
// Prettier is configured for consistent code formatting.
