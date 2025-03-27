const { param } = require('express-validator');
const { validate, isValidObjectId } = require('../utils/validation');

// Middleware to validate MongoDB ObjectId parameter
const validateObjectId = (paramName) => {
  return [
    param(paramName)
      .custom((value) => {
        if (!isValidObjectId(value)) {
          throw new Error(`Invalid ${paramName}`);
        }
        return true;
      }),
    validate,
  ];
};

module.exports = {
  validateObjectId,
};