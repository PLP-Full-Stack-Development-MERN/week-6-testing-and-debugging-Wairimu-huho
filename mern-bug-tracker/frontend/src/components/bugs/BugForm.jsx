import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { bugApi } from '../../services/api';
import { setFormErrors, bugValidationRules } from '../../utils/errorUtils';
import Alert from '../ui/Alert';

/**
 * Component for creating or editing bugs
 * @param {Object} props - Component props
 * @param {Object} [props.bug] - Existing bug data for editing (optional)
 * @param {Function} [props.onSuccess] - Callback after successful submission
 * @returns {JSX.Element} Bug form
 */
const BugForm = ({ bug, onSuccess }) => {
  const isEditMode = !!bug;
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing bug data or defaults
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    defaultValues: bug || {
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      reportedBy: '',
      project: '',
      stepsToReproduce: '',
      assignedTo: 'Unassigned',
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setAlert({ type: '', message: '' });

      let response;
      if (isEditMode) {
        response = await bugApi.updateBug(bug._id, data);
      } else {
        response = await bugApi.createBug(data);
      }

      setAlert({
        type: 'success',
        message: isEditMode
          ? 'Bug updated successfully!'
          : 'Bug created successfully!',
      });

      // Reset form if creating a new bug
      if (!isEditMode) {
        reset();
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error submitting bug:', error);
      setAlert({
        type: 'error',
        message: error.message || 'An error occurred. Please try again.',
      });
      
      // Set field-specific errors from API
      setFormErrors(error, setError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">
        {isEditMode ? 'Edit Bug' : 'Report New Bug'}
      </h2>

      {alert.message && (
        <div className="mb-6">
          <Alert
            type={alert.type}
            message={alert.message}
            dismissible
            onDismiss={() => setAlert({ type: '', message: '' })}
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="form-label">
              Bug Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter a descriptive title"
              {...register('title', bugValidationRules.title)}
              data-testid="bug-title-input"
              aria-invalid={errors.title ? 'true' : 'false'}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600" data-testid="title-error">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Project */}
          <div>
            <label htmlFor="project" className="form-label">
              Project <span className="text-red-500">*</span>
            </label>
            <input
              id="project"
              type="text"
              className={`form-input ${errors.project ? 'border-red-500' : ''}`}
              placeholder="Project name"
              {...register('project', bugValidationRules.project)}
            />
            {errors.project && (
              <p className="mt-1 text-sm text-red-600">
                {errors.project.message}
              </p>
            )}
          </div>

          {/* Reported By */}
          <div>
            <label htmlFor="reportedBy" className="form-label">
              Reported By <span className="text-red-500">*</span>
            </label>
            <input
              id="reportedBy"
              type="text"
              className={`form-input ${
                errors.reportedBy ? 'border-red-500' : ''
              }`}
              placeholder="Your name"
              {...register('reportedBy', bugValidationRules.reportedBy)}
            />
            {errors.reportedBy && (
              <p className="mt-1 text-sm text-red-600">
                {errors.reportedBy.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className="form-select"
              {...register('status', bugValidationRules.status)}
              data-testid="bug-status-select"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              id="priority"
              className="form-select"
              {...register('priority', bugValidationRules.priority)}
              data-testid="bug-priority-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">
                {errors.priority.message}
              </p>
            )}
          </div>

          {/* Assigned To */}
          <div>
            <label htmlFor="assignedTo" className="form-label">
              Assigned To
            </label>
            <input
              id="assignedTo"
              type="text"
              className="form-input"
              placeholder="Leave blank if unassigned"
              {...register('assignedTo')}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="form-label">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows="4"
              className={`form-textarea ${
                errors.description ? 'border-red-500' : ''
              }`}
              placeholder="Describe the issue in detail"
              {...register('description', bugValidationRules.description)}
              data-testid="bug-description-input"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Steps to Reproduce */}
          <div className="md:col-span-2">
            <label htmlFor="stepsToReproduce" className="form-label">
              Steps to Reproduce
            </label>
            <textarea
              id="stepsToReproduce"
              rows="3"
              className="form-textarea"
              placeholder="List the steps to reproduce this bug"
              {...register('stepsToReproduce')}
            ></textarea>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/bugs')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            data-testid="submit-bug-button"
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Bug' : 'Create Bug'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugForm;