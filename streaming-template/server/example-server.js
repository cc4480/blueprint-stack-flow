
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { setupStreamingRoutes } = require('./streaming-routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Setup streaming routes
setupStreamingRoutes(app);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.DEEPSEEK_API_KEY
  });
});

// Serve React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔑 DeepSeek API Key: ${process.env.DEEPSEEK_API_KEY ? 'Configured' : 'Missing'}`);
});
