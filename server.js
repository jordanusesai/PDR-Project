require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const expenseRoutes = require('./routes/expenses');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);

// Database connection - Enhanced for production
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("❌ ERROR: MONGODB_URI is not defined in environment variables!");
  console.error("Please set MONGODB_URI in your Render environment variables");
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.code === 8000) {
      console.error('🔑 Authentication failed - Check your MongoDB credentials');
    }
  });

  const path = require('path');

// 1. Serve static files from the React frontend build folder
// 'client/build' is standard for Create React App. 
app.use(express.static(path.join(__dirname, 'client/build')));

// 2. Anything that doesn't match an API route, send back the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// PORT setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
