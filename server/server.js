require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

// ─── Validate required environment variables ─────────────────────────────────
const required = ['MONGO_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key] || !process.env[key].trim());

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  console.error('   Set them in your .env file (local) or Render dashboard (production).');
  process.exit(1);
}

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📱 Client URL: ${process.env.CLIENT_URL}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });

  // ─── Graceful shutdown (Render sends SIGTERM on deploy/restart) ─────────
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received — shutting down gracefully...');
    server.close(() => {
      mongoose.connection.close(false).then(() => {
        console.log('✅ MongoDB connection closed.');
        process.exit(0);
      });
    });
  });
});