const express = require('express');
const connectDB = require('./config/db'); // make sure path is correct
require('dotenv').config();

const app = express();
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('MongoDB Connected!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
