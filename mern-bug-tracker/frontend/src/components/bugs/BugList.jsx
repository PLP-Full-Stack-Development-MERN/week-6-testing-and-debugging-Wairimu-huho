import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bugApi } from '../../services/api';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import Loading from '../ui/Loading';
import Alert from '../ui/Alert';

/**
 * Component for displaying a list of bugs with filtering options
 * @returns {JSX.Element} Bug list component
 */
const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBugs: 0,
  });

  // Fetch bugs with filters and pagination
  const fetchBugs = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query params
      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      };

      const response = await bugApi.getBugs(params);
      
      // Update state with response data
      setBugs(response.data);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalBugs: response.total,
      });
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError(err.message || 'Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch bugs on initial load and when filters or pagination change
  useEffect(() => {
    fetchBugs();
  }, [filters, pagination.currentPage]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Reset to first page when changing filters
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle search term changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply search filter to bugs
  const filteredBugs = bugs.filter((bug) => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      bug.title.toLowerCase().includes(term) ||
      bug.description.toLowerCase().includes(term) ||
      bug.project.toLowerCase().includes(term) ||
      bug.reportedBy.toLowerCase().includes(term) ||
      bug.assignedTo.toLowerCase().includes(term)
    );
  });

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && bugs.length === 0) {
    return <Loading message="Loading bugs..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Bug List</h1>
        <Link to="/bugs/new" className="btn btn-primary">
          Report New Bug
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="form-label">
              Search
            </label>
            <input
              id="search"
              type="text"
              className="form-input"
              placeholder="Search bugs..."
              value={searchTerm}
              onChange={handleSearchChange}
              data-testid="search-input"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={filters.status}
              onChange={handleFilterChange}
              data-testid="status-filter"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={filters.priority}
              onChange={handleFilterChange}
              data-testid="priority-filter"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <label htmlFor="project" className="form-label">
              Project
            </label>
            <input
              id="project"
              name="project"
              type="text"
              className="form-input"
              placeholder="Filter by project"
              value={filters.project}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert
          type="error"
          message={error}
          dismissible
          onDismiss={() => setError('')}
        />
      )}

      {/* Bug Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {filteredBugs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No bugs found. Try adjusting your filters or{' '}
            <Link to="/bugs/new" className="text-primary-600 hover:underline">
              report a new bug
            </Link>
            .
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBugs.map((bug) => (
                <tr key={bug._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-normal">
                    <Link
                      to={`/bugs/${bug._id}`}
                      className="text-primary-600 hover:text-primary-900 font-medium"
                      data-testid={`bug-link-${bug._id}`}
                    >
                      {bug.title}
                    </Link>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {bug.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={bug.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={bug.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{bug.project}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(bug.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bug.assignedTo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center space-x-4 mt-4">
          <div>
            <span className="text-sm text-gray-700">
              Showing page {pagination.currentPage} of {pagination.totalPages} (
              {pagination.totalBugs} total bugs)
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="btn btn-outline px-3 py-1"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-outline px-3 py-1"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugList;