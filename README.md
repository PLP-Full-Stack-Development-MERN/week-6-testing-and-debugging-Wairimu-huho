# MERN Bug Tracker - Backend

This is the backend for the MERN Bug Tracker application, which demonstrates testing and debugging best practices in a MERN stack application.

## Features

- RESTful API for bug tracking
- Comprehensive error handling
- Validation of requests
- Logging system for debugging
- Complete test suite with unit and integration tests

## Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── models/           # MongoDB models
├── routes/           # API routes
├── tests/            # Test files
│   ├── integration/  # API tests
│   └── unit/         # Unit tests
└── utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mern-bug-tracker.git
   cd mern-bug-tracker/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root of the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bug-tracker
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Testing

The backend includes a comprehensive test suite with both unit and integration tests using Jest.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Testing Strategy

1. **Unit Tests**: Test individual functions and utilities in isolation.
   - Located in `tests/unit/`
   - Focus on validation logic and helper functions

2. **Integration Tests**: Test API endpoints with an in-memory MongoDB database.
   - Located in `tests/integration/`
   - Test the complete request/response cycle

### Test Coverage

The test suite aims to cover:
- Input validation
- Error handling
- Database operations
- API responses
- Edge cases

## Debugging

### Debugging Tools

1. **Logging**:
   - Winston logger is configured for structured logging
   - Different log levels (error, warn, info, debug)
   - Logs are stored in `logs/` directory in production

2. **Error Handling**:
   - Custom error middleware with proper status codes
   - Standardized error responses
   - Stack traces in development environment

3. **Validation**:
   - Request validation using express-validator
   - Mongoose schema validation

### Debugging Tips

1. Use different log levels:
   ```javascript
   logger.debug('Detailed debug information');
   logger.info('Standard operation information');
   logger.warn('Warning condition');
   logger.error('Error condition', error);
   ```

2. Use Node.js inspector:
   ```bash
   # Start server with inspector
   node --inspect server.js
   ```

3. Test API endpoints with Postman or Insomnia

## API Endpoints

### Bugs

- `GET /api/bugs` - Get all bugs (with optional filtering)
- `GET /api/bugs/:id` - Get a specific bug
- `POST /api/bugs` - Create a new bug
- `PUT /api/bugs/:id` - Update a bug
- `DELETE /api/bugs/:id` - Delete a bug
- `GET /api/bugs/stats` - Get bug statistics

## Error Handling Implementation

The application uses a global error handling middleware that:

1. Logs errors appropriately
2. Formats error responses consistently
3. Handles different error types:
   - Validation errors
   - Not found errors
   - Database errors
   - Authentication errors

Example error response:
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```