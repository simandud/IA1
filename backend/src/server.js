require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const passport = require('./config/passport');

// Import database connections
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const taskRoutes = require('./routes/tasks');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const searchRoutes = require('./routes/search');
const activityRoutes = require('./routes/activity');
const fileRoutes = require('./routes/files');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import socket initialization
const { initializeSocket } = require('./socket');

// Initialize express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Make io accessible in controllers
app.set('io', io);

// Connect to database
connectDB();

// Connect to Redis (optional - for caching)
connectRedis().catch(err => console.log('Redis not available:', err.message));

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Session middleware for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/files', fileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Initialize Socket.io
initializeSocket(io);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Workforce Social Network Server                 ║
║                                                       ║
║   Environment: ${process.env.NODE_ENV || 'development'}                           ║
║   Server running on port: ${PORT}                       ║
║   Socket.io enabled: ✓                                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = { app, server, io };
