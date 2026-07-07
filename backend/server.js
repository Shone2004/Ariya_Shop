require('dotenv').config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const { initTransporter } = require('./services/transporter');

const dns = require("node:dns");

// Force Node to use Google's DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Import routes
const orderRoutes   = require('./routes/orderRoutes');
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes    = require('./routes/cartRoutes');
const wishlistRoutes= require('./routes/wishlistRoutes');
const uploadRoutes  = require('./routes/uploadRoutes');
const userRoutes    = require('./routes/userRoutes');
const supportRoutes = require("./routes/supportRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Proxy for Render deployment
app.set("trust proxy", 1);

// Connect to MongoDB
connectDB();

// HTTP Security & Compression Middleware
app.use(helmet());
app.use(compression());

// Secure CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "https://www.ariyashop.in",
  "https://ariya-admin.vercel.app",
].filter(origin => origin && origin.trim() !== "");

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Centralized Rate Limiter Configurations
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many registration attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many payment verification attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many contact submissions, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const supportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many support ticket submissions, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply Global Rate Limiter
app.use(globalLimiter);

// Apply Route-Specific Rate Limiters
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/orders/verify', paymentLimiter);
app.use('/api/contact', contactLimiter);
app.use('/api/support', (req, res, next) => {
  if (req.method === 'POST' && (req.path === '/' || req.path === '')) {
    return supportLimiter(req, res, next);
  }
  next();
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/orders',    orderRoutes);
app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/wishlist',  wishlistRoutes);
app.use('/api/upload',    uploadRoutes);
app.use('/api/users',     userRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/contact", contactRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Ariya Shop API is running...');
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, async () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log("DNS Servers:", dns.getServers());
  }
  console.log(`Server is running on port ${PORT}`);
  // Initialise Brevo SMTP transporter (non-blocking — won't crash server on failure)
  await initTransporter();
});

// Graceful Shutdown Handler
const mongoose = require('mongoose');

const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during MongoDB connection closure:', err);
      process.exit(1);
    }
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
