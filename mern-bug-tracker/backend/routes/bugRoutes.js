const express = require('express');
const {
  getBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats,
} = require('../controllers/bugController');
const { bugValidationRules, validate } = require('../utils/validation');
const { validateObjectId } = require('../middleware/validateRequest');

const router = express.Router();

// Get bug statistics
router.get('/stats', getBugStats);

// Get all bugs and create a bug
router
  .route('/')
  .get(getBugs)
  .post(bugValidationRules(), validate, createBug);

// Get, update, and delete a bug by ID
router
  .route('/:id')
  .get(validateObjectId('id'), getBugById)
  .put(validateObjectId('id'), bugValidationRules(), validate, updateBug)
  .delete(validateObjectId('id'), deleteBug);

module.exports = router;