import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bugApi } from '../../services/api';
import Loading from '../ui/Loading';
import Alert from '../ui/Alert';

/**
 * Component for displaying bug statistics dashboard
 * @returns {JSX.Element} Dashboard component
 */
const Dashboard = () => {
  const [stats, setStats] = useState({
    status: [],
    priority: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch bug statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bugApi.getBugStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching bug statistics:', err);
      setError(err.message || 'Failed to fetch bug statistics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Status colors for chart
  const statusColors = {
    open: '#0ea5e9', // blue-500
    'in-progress': '#8b5cf6', // purple-500
    resolved: '#10b981', // green-500
    closed: '#6b7280', // gray-500
  };

  // Priority colors for chart
  const priorityColors = {
    low: '#10b981', // green-500
    medium: '#f59e0b', // amber-500
    high: '#ef4444', // red-500
    critical: '#7f1d1d', // red-900
  };

  // Total bug count
  const totalBugs =
    stats.status.reduce((total, item) => total + item.count, 0) || 0;

  if (loading) {
    return <Loading message="Loading dashboard statistics..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {error && (
        <Alert
          type="error"
          message={error}
          dismissible
          onDismiss={() => setError('')}
        />
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/bugs/new"
              className="btn btn-primary w-full"
              data-testid="report-bug-button"
            >
              Report New Bug
            </Link>
            <Link
              to="/bugs"
              className="btn btn-outline w-full"
              data-testid="view-bugs-button"
            >
              View All Bugs
            </Link>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bug Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{totalBugs}</div>
              <div className="text-sm text-gray-500">Total Bugs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-status-open">
                {stats.status.find((s) => s._id === 'open')?.count || 0}
              </div>
              <div className="text-sm text-gray-500">Open Bugs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-status-in-progress">
                {stats.status.find((s) => s._id === 'in-progress')?.count || 0}
              </div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-status-resolved">
                {stats.status.find((s) => s._id === 'resolved')?.count || 0}
              </div>
              <div className="text-sm text-gray-500">Resolved</div>
            </div>
          </div>
        </div>

        {/* Critical bugs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Critical & High Priority
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-priority-critical">
                {stats.priority.find((p) => p._id === 'critical')?.count || 0}
              </div>
              <div className="text-sm text-gray-500">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-priority-high">
                {stats.priority.find((p) => p._id === 'high')?.count || 0}
              </div>
              <div className="text-sm text-gray-500">High</div>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/bugs?priority=high,critical"
              className="btn btn-outline w-full"
            >
              View High Priority Bugs
            </Link>
          </div>
        </div>
      </div>

      {/* Status chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bugs by Status</h2>
          <div className="h-64 flex items-end space-x-4">
            {stats.status.map((status) => {
              // Calculate the percentage height
              const percentage = totalBugs ? (status.count / totalBugs) * 100 : 0;
              const statusName =
                status._id.charAt(0).toUpperCase() +
                status._id.slice(1).replace(/-/g, ' ');
              
              return (
                <div
                  key={status._id}
                  className="flex flex-col items-center flex-1"
                  data-testid={`status-bar-${status._id}`}
                >
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${Math.max(percentage, 2)}%`,
                      backgroundColor: statusColors[status._id] || '#94a3b8',
                    }}
                  ></div>
                  <div className="mt-2 text-sm font-medium text-gray-600">
                    {statusName}
                  </div>
                  <div className="text-sm text-gray-500">{status.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Bugs by Priority
          </h2>
          <div className="h-64 flex items-end space-x-4">
            {stats.priority.map((priority) => {
              // Calculate the percentage height
              const percentage = totalBugs ? (priority.count / totalBugs) * 100 : 0;
              const priorityName =
                priority._id.charAt(0).toUpperCase() + priority._id.slice(1);
              
              return (
                <div
                  key={priority._id}
                  className="flex flex-col items-center flex-1"
                  data-testid={`priority-bar-${priority._id}`}
                >
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${Math.max(percentage, 2)}%`,
                      backgroundColor: priorityColors[priority._id] || '#94a3b8',
                    }}
                  ></div>
                  <div className="mt-2 text-sm font-medium text-gray-600">
                    {priorityName}
                  </div>
                  <div className="text-sm text-gray-500">{priority.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Projects table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Bugs by Project</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bug Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.projects.map((project) => {
                // Calculate percentage
                const percentage = totalBugs ? (project.count / totalBugs) * 100 : 0;
                
                return (
                  <tr key={project._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {project._id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{project.count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/bugs?project=${encodeURIComponent(project._id)}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Bugs
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;