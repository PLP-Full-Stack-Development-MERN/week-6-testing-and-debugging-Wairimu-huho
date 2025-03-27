const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Bug title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Bug description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['open', 'in-progress', 'resolved', 'closed'],
        message: '{VALUE} is not supported as a status',
      },
      default: 'open',
    },
    priority: {
      type: String,
      required: true,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: '{VALUE} is not supported as a priority',
      },
      default: 'medium',
    },
    assignedTo: {
      type: String,
      trim: true,
      default: 'Unassigned',
    },
    reportedBy: {
      type: String,
      required: [true, 'Reporter name is required'],
      trim: true,
    },
    stepsToReproduce: {
      type: String,
      trim: true,
    },
    project: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
bugSchema.index({ status: 1 });
bugSchema.index({ priority: 1 });
bugSchema.index({ project: 1 });

// Create a virtual for formattedCreatedAt
bugSchema.virtual('formattedCreatedAt').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;