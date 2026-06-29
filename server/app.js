const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Trust first proxy (Render's load balancer) — required for secure cookies behind reverse proxy
app.set('trust proxy', 1);

// CORS — supports comma-separated list in CLIENT_URL for multi-origin (dev + prod)
// Production Vercel URL is always included as a guaranteed fallback
const PRODUCTION_ORIGIN = 'https://foodeasey.vercel.app';

const allowedOrigins = [
  PRODUCTION_ORIGIN,
  ...( process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim()),
];

// Deduplicate in case CLIENT_URL already contains the production URL
const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (uniqueAllowedOrigins.includes(origin)) return callback(null, true);
      // Return a proper CORS error — Express will forward to the error handler
      return callback(new Error(`CORS: Origin '${origin}' not allowed`));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🍔 FoodEasey API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
