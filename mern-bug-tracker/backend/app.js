const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bugRoutes = require('./routes/bugRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const logger = require('./config/logger');

// Create Express app
const app = express();

// Apply global middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Custom request logger
app.use((req, res, next) => {
  // Log after the request completes
  res.on('finish', () => {
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${res.get(
        'Content-Length'
      ) || 0}b`
    );
  });
  next();
});

// Define routes
app.use('/api/bugs', bugRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Handle 404 errors
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;