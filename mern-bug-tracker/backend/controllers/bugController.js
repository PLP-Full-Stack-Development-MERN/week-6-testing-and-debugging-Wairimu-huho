const Bug = require('../models/Bug');
const { ApiError } = require('../middleware/errorMiddleware');
const { isValidStatusTransition } = require('../utils/validation');
const logger = require('../config/logger');

// @desc    Get all bugs with optional filtering
// @route   GET /api/bugs
// @access  Public
const getBugs = async (req, res, next) => {
  try {
    const { status, priority, project, sort = '-createdAt' } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (project) filter.project = project;

    // Execute query with pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const bugs = await Bug.find(filter)
      .sort(sort)
      .skip(startIndex)
      .limit(limit);

    const total = await Bug.countDocuments(filter);

    // Send response
    res.json({
      success: true,
      count: bugs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: bugs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single bug by ID
// @route   GET /api/bugs/:id
// @access  Public
const getBugById = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return next(new ApiError(404, `Bug not found with id ${req.params.id}`));
    }

    res.json({
      success: true,
      data: bug,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new bug
// @route   POST /api/bugs
// @access  Public
const createBug = async (req, res, next) => {
  try {
    // Create bug
    const bug = await Bug.create(req.body);

    logger.info(`Bug created: ${bug._id} - ${bug.title}`);

    res.status(201).json({
      success: true,
      data: bug,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a bug
// @route   PUT /api/bugs/:id
// @access  Public
const updateBug = async (req, res, next) => {
  try {
    let bug = await Bug.findById(req.params.id);

    if (!bug) {
      return next(new ApiError(404, `Bug not found with id ${req.params.id}`));
    }

    // Check if status transition is valid
    if (req.body.status && bug.status !== req.body.status) {
      if (!isValidStatusTransition(bug.status, req.body.status)) {
        return next(
          new ApiError(400, `Invalid status transition from '${bug.status}' to '${req.body.status}'`)
        );
      }
    }

    // Update bug
    bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    logger.info(`Bug updated: ${bug._id} - ${bug.title}`);

    res.json({
      success: true,
      data: bug,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a bug
// @route   DELETE /api/bugs/:id
// @access  Public
const deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return next(new ApiError(404, `Bug not found with id ${req.params.id}`));
    }

    await bug.deleteOne();

    logger.info(`Bug deleted: ${req.params.id}`);

    res.json({
      success: true,
      data: {},
      message: 'Bug successfully deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bug statistics
// @route   GET /api/bugs/stats
// @access  Public
const getBugStats = async (req, res, next) => {
  try {
    // Get counts by status
    const statusStats = await Bug.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get counts by priority
    const priorityStats = await Bug.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get counts by project
    const projectStats = await Bug.aggregate([
      {
        $group: {
          _id: '$project',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.json({
      success: true,
      data: {
        status: statusStats,
        priority: priorityStats,
        projects: projectStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats,
};