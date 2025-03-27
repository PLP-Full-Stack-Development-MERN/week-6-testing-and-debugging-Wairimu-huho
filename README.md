# MERN Bug Tracker

A comprehensive bug tracking application built with the MERN stack (MongoDB, Express, React, Node.js), focusing on testing and debugging best practices. This project demonstrates how to implement proper testing methodologies and debugging techniques in a full-stack JavaScript application.

## Features

- 🐞 Create, view, update, and delete bugs
- 📊 Dashboard with bug statistics and visualizations
- 🔍 Search and filter bugs by various criteria
- 📱 Responsive design with Tailwind CSS
- ✅ Comprehensive test suite for both frontend and backend
- 🛠️ Robust error handling and debugging tools

## Project Structure

The project is divided into two main parts:

```
mern-bug-tracker/
├── backend/          # Express and MongoDB backend
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Express middleware
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── tests/        # Backend tests
│   └── utils/        # Utility functions
│
├── frontend/         # React frontend (Vite)
    ├── public/       # Static files
    └── src/          # React source code
        ├── components/  # React components
        ├── services/    # API services
        ├── utils/       # Utility functions
        └── test/        # Frontend tests
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mern-bug-tracker.git
   cd mern-bug-tracker
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   
   For backend, create a `.env` file in the `backend` directory:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bug-tracker
   ```
   
   For frontend, create a `.env` file in the `frontend` directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## Testing

### Backend Tests

```bash
cd backend
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Testing Strategy

This project implements a comprehensive testing strategy including:

### Backend Testing

1. **Unit Tests**:
   - Tests for individual helper functions
   - Validation logic tests
   - Error handling tests

2. **Integration Tests**:
   - API route tests with an in-memory MongoDB database
   - Request validation tests
   - Error middleware tests

### Frontend Testing

1. **Unit Tests**:
   - Component rendering tests
   - Form validation tests
   - Utility function tests

2. **Integration Tests**:
   - API service tests with mock server
   - Form submission tests
   - Component interaction tests

3. **End-to-End Tests** (optional):
   - User flows from bug creation to resolution

## Debugging Techniques

The project demonstrates various debugging techniques:

### Backend Debugging

1. **Logging**:
   - Structured logging with Winston
   - Different log levels for development and production
   - Request/response logging

2. **Error Handling**:
   - Custom error classes
   - Centralized error middleware
   - Standardized error responses

3. **Node.js Debugging**:
   - Using the Node.js inspector
   - Debugging with VS Code
   - Debug configurations

### Frontend Debugging

1. **React DevTools**:
   - Component inspection
   - State and props monitoring
   - Performance profiling

2. **Error Boundaries**:
   - Graceful error handling in UI
   - Fallback UI components
   - Error reporting

3. **Network Debugging**:
   - API request/response logging
   - Mock server for testing
   - Axios interceptors

4. **Console Techniques**:
   - Structured console logs
   - Performance measurements
   - Conditional debugging

## Intentional Bugs for Learning

The project includes some intentional bugs in `utils/debugExamples.js` to practice debugging techniques:

1. **Array Index Out of Bounds**: Bug in loop condition
2. **Undefined Property Access**: Missing null checks
3. **Asynchronous Error Handling**: Inadequate Promise error handling
4. **Logical Errors**: Incorrect calculations
5. **Memory Leaks**: Unbounded array growth

Follow the [Debugging Guide](backend/DEBUGGING.md) to learn how to identify and fix these issues.

## Code Quality and Best Practices

- **ESLint & Prettier**: Consistent code style
- **Error Handling**: Comprehensive error handling
- **Documentation**: JSDoc comments for functions and components
- **Testing**: High test coverage
- **Accessibility**: ARIA attributes and keyboard navigation
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Jest](https://jestjs.io/) & [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)