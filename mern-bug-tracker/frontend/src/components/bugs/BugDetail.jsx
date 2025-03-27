import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bugApi } from '../../services/api';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import Loading from '../ui/Loading';
import Alert from '../ui/Alert';
import BugForm from './BugForm';

/**
 * Component for displaying bug details and actions
 * @returns {JSX.Element} Bug detail component
 */
const BugDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch bug details
  const fetchBug = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bugApi.getBugById(id);
      setBug(response.data);
    } catch (err) {
      console.error('Error fetching bug:', err);
      setError(err.message || 'Failed to fetch bug details');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete bug
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this bug?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await bugApi.deleteBug(id);
      // Redirect to bug list after successful deletion
      navigate('/bugs', {
        state: { alert: { type: 'success', message: 'Bug deleted successfully' } }
      });
    } catch (err) {
      console.error('Error deleting bug:', err);
      setAlert({
        type: 'error',
        message: err.message || 'Failed to delete bug',
      });
      setIsDeleting(false);
    }
  };

  // Handle successful update
  const handleUpdateSuccess = (updatedBug) => {
    setBug(updatedBug);
    setIsEditing(false);
    setAlert({
      type: 'success',
      message: 'Bug updated successfully',
    });
  };

  // Fetch bug on initial load
  useEffect(() => {
    fetchBug();
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && !bug) {
    return <Loading message="Loading bug details..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error} />
        <Link to="/bugs" className="btn btn-primary">
          Back to Bug List
        </Link>
      </div>
    );
  }

  // Show edit form if in editing mode
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Bug</h1>
          <button
            className="btn btn-outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
        <BugForm bug={bug} onSuccess={handleUpdateSuccess} />
      </div>
    );
  }

  // Show bug details
  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          dismissible
          onDismiss={() => setAlert({ type: '', message: '' })}
        />
      )}

      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold break-words">{bug?.title}</h1>
        <div className="flex space-x-2">
          <button
            className="btn btn-outline"
            onClick={() => setIsEditing(true)}
            data-testid="edit-bug-button"
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
            data-testid="delete-bug-button"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Bug details card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Status and priority */}
            <div className="flex flex-wrap gap-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>{' '}
                <StatusBadge status={bug?.status} />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Priority:</span>{' '}
                <PriorityBadge priority={bug?.priority} />
              </div>
            </div>

            {/* Project */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Project</h3>
              <p className="mt-1 text-md">{bug?.project}</p>
            </div>

            {/* Reporter/Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
                <p className="mt-1">{bug?.reportedBy}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                <p className="mt-1">{bug?.assignedTo || 'Unassigned'}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p className="mt-1 text-sm">{formatDate(bug?.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 text-sm">{formatDate(bug?.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <div className="mt-2 prose prose-sm max-w-none text-gray-900">
                <p className="whitespace-pre-wrap">{bug?.description}</p>
              </div>
            </div>

            {/* Steps to reproduce */}
            {bug?.stepsToReproduce && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Steps to Reproduce</h3>
                <div className="mt-2 prose prose-sm max-w-none text-gray-900">
                  <p className="whitespace-pre-wrap">{bug?.stepsToReproduce}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back button */}
      <div>
        <Link to="/bugs" className="btn btn-outline">
          Back to Bug List
        </Link>
      </div>
    </div>
  );
};

export default BugDetail;