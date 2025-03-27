const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  }
);

// Create logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: 'bug-tracker-api' },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    // File transports for production environment
    ...(process.env.NODE_ENV === 'production'
      ? [
          // Error log
          new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
          }),
          // Combined log
          new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
          }),
        ]
      : []),
  ],
  // Don't exit on handled exceptions
  exitOnError: false,
});

module.exports = logger;