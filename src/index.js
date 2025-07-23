const express = require('express');
const connectDB = require('./config/db'); 
require('dotenv').config();
const cors = require('cors');
const schedule = require('node-schedule');
const moveExpiredForms = require('./utils/moveExpiredForms');
const http = require('http');
const { Server } = require('socket.io');

// Models
const QueueReceivedPayments = require('./models/queueReceivedPayment.model');
const QueueSubmittedForms = require('./models/queueSubmitedForm.model');
const Students = require('./models/student.model');
const TempRegistration = require('./models/tempRegistration.model');

const app = express();
app.use(express.json());
connectDB();

// CORS
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Routes
app.use('/temp-registrations', require('./routes/tempRegistrations.routes'));
app.use('/queue-submitted-forms', require('./routes/queueSubmitedForm.routes'));
app.use('/payments', require('./routes/payments.routes'));
app.use('/queue-received-payments', require('./routes/queueReceivedPayment.routes'));
app.use('/students', require('./routes/students.routes'));
app.use('/admin', require('./routes/admin.routes'));

app.get('/', (req, res) => res.send('Welcome to the backend API!'));

// HTTP + WebSocket Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// WebSocket Connection
io.on('connection', async (socket) => {
  console.log(`⚡ Admin Dashboard Connected: ${socket.id}`);

  // Send initial data on connection
  await sendQueueData(socket);

  // Client can request latest data manually
  socket.on('get_latest_data', async () => {
    await sendQueueData(socket);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Admin Dashboard Disconnected: ${socket.id}`);
  });
});

// Send Queue Data
async function sendQueueData(socket) {

  try {
    const paymentEntries = await QueueReceivedPayments.find({}).sort({ receivedAt: -1 });
    const registrationEntries = await QueueSubmittedForms.find({}).sort({ submittedAt : -1 });
    const tempRegistrationUnmatch = await TempRegistration.find({ paymentStatus: 'unmatchAmount' });
    const ticketsSold = await Students.countDocuments();

    socket.emit('queue_update', {
      paymentEntries,
      registrationEntries,
      tempRegistrationUnmatch,
      ticketsSold
    });

  } catch (error) {
    console.error('Error sending queue data:', error);
  }

}

// MongoDB Change Streams (real-time updates)
function watchQueueCollections() {
  
  try {
    const paymentWatcher = QueueReceivedPayments.watch();
    const registrationWatcher = QueueSubmittedForms.watch();

    paymentWatcher.on('change', async () => {
      console.log('🔔 Payment queue updated, pushing new data...');
      const allSockets = await io.fetchSockets();
      allSockets.forEach((s) => sendQueueData(s));
    });

    registrationWatcher.on('change', async () => {
      console.log('🔔 Registration queue updated, pushing new data...');
      const allSockets = await io.fetchSockets();
      allSockets.forEach((s) => sendQueueData(s));
    });

  } catch (err) {
    console.error('Error watching collections:', err);
  }
}

watchQueueCollections();

// Scheduled Jobs (Production Only)
// schedule.scheduleJob('*/1 * * * *', async () => {
//   console.log("🔄 Checking for expired forms...");
//   await moveExpiredForms();
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
