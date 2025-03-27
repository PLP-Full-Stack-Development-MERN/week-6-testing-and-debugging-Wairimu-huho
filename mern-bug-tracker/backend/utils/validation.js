const { body, validationResult } = require('express-validator');

// Validation rules for creating/updating a bug
const bugValidationRules = () => {
  return [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Bug title is required')
      .isLength({ max: 100 })
      .withMessage('Title cannot be more than 100 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Bug description is required')
      .isLength({ max: 1000 })
      .withMessage('Description cannot be more than 1000 characters'),
    body('status')
      .optional()
      .isIn(['open', 'in-progress', 'resolved', 'closed'])
      .withMessage('Status must be one of: open, in-progress, resolved, closed'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Priority must be one of: low, medium, high, critical'),
    body('reportedBy')
      .trim()
      .notEmpty()
      .withMessage('Reporter name is required'),
    body('project')
      .trim()
      .notEmpty()
      .withMessage('Project name is required'),
  ];
};

// Function to check if ID is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
  const ObjectId = require('mongoose').Types.ObjectId;
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
};

// Function to check bug status transition validity
const isValidStatusTransition = (currentStatus, newStatus) => {
  // Define allowed transitions
  const allowedTransitions = {
    'open': ['in-progress', 'resolved', 'closed'],
    'in-progress': ['open', 'resolved', 'closed'],
    'resolved': ['in-progress', 'closed', 'open'],
    'closed': ['open'] // Reopening a closed bug
  };

  // If current status is same as new status, it's always valid
  if (currentStatus === newStatus) return true;

  // Check if the transition is allowed
  return allowedTransitions[currentStatus]?.includes(newStatus) || false;
};

// Format validation errors for consistent API responses
const formatValidationErrors = (errors) => {
  return errors.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));
};

// Middleware to validate request
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    errors: formatValidationErrors(errors),
  });
};

module.exports = {
  bugValidationRules,
  validate,
  isValidObjectId,
  isValidStatusTransition,
  formatValidationErrors,
};