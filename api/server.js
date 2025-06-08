const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const aiService = require('./services/aiService');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/user');
const frameworkRoutes = require('./routes/frameworks');

const app = express();

// For Vercel deployment, we'll handle WebSocket differently
let server, io;

if (process.env.NODE_ENV !== 'production') {
  // Development mode with WebSocket support
  server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
} else {
  // Production mode on Vercel (serverless)
  server = app;
  io = null; // WebSocket not supported in serverless
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 generation requests per hour
  message: 'Too many generation requests, please try again later.',
});

app.use(limiter);
app.use('/api/generate-app', generateLimiter);

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/frameworks', frameworkRoutes);

// AI App Generation Route
app.post('/api/generate-app', async (req, res) => {
  try {
    const { prompt, frameworks } = req.body;

    // Validate input
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        error: 'Prompt is required',
        code: 'MISSING_PROMPT'
      });
    }

    if (!frameworks || !Array.isArray(frameworks) || frameworks.length === 0) {
      return res.status(400).json({
        error: 'At least one AI framework must be selected',
        code: 'MISSING_FRAMEWORKS'
      });
    }

    // Get client socket ID from headers (if available)
    const socketId = req.headers['x-socket-id'];

    // Start generation process
    const result = await aiService.generateApp(prompt, frameworks, (progress) => {
      // Emit progress updates via WebSocket (only in development)
      if (io) {
        if (socketId) {
          io.to(socketId).emit('generation-progress', progress);
        } else {
          io.emit('generation-progress', progress);
        }
      }
    });

    // Emit completion event (only in development)
    if (io) {
      if (socketId) {
        io.to(socketId).emit('generation-complete', result);
      } else {
        io.emit('generation-complete', result);
      }
    }

    res.json(result);
  } catch (error) {
    console.error('App generation error:', error);

    // Emit error event (only in development)
    const socketId = req.headers['x-socket-id'];
    if (io) {
      if (socketId) {
        io.to(socketId).emit('generation-error', error.message);
      } else {
        io.emit('generation-error', error.message);
      }
    }

    res.status(500).json({
      error: error.message || 'Generation failed',
      code: 'GENERATION_ERROR'
    });
  }
});

// WebSocket connection handling (only in development)
if (io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('start-generation', async (data) => {
      try {
        console.log('Starting generation for socket:', socket.id);

        const { prompt, frameworks } = data;

        // Validate input
        if (!prompt || !frameworks || frameworks.length === 0) {
          socket.emit('generation-error', 'Invalid input data');
          return;
        }

        // Start generation with progress callbacks
        const result = await aiService.generateApp(prompt, frameworks, (progress) => {
          socket.emit('generation-progress', progress);
        });

        socket.emit('generation-complete', result);
      } catch (error) {
        console.error('WebSocket generation error:', error);
        socket.emit('generation-error', error.message);
      }
    });

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

// Error handling middleware
app.use((err, req, res, _next) => { // next prefixed with _ as it's required by Express but not used
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND'
  });
});

// For Vercel, we export the app directly
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  // Development mode with server
  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    if (io) {
      console.log(`🔌 WebSocket server ready`);
    }
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });

  module.exports = { app, server, io };
}
