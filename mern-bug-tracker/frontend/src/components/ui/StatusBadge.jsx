import React from 'react';

/**
 * Component for displaying bug status as a badge
 * @param {Object} props - Component props
 * @param {string} props.status - Bug status (open, in-progress, resolved, closed)
 * @returns {JSX.Element} Status badge
 */
const StatusBadge = ({ status }) => {
  // Define badge styles based on status
  const badgeClass = `status-badge-${status}`;
  
  // Format status text
  const formatStatus = (status) => {
    if (!status) return '';
    
    // Convert kebab-case to Title Case (e.g., 'in-progress' -> 'In Progress')
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={badgeClass} data-testid="status-badge">
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;