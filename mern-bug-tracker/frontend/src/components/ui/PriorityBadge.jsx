import React from 'react';

/**
 * Component for displaying bug priority as a badge
 * @param {Object} props - Component props
 * @param {string} props.priority - Bug priority (low, medium, high, critical)
 * @returns {JSX.Element} Priority badge
 */
const PriorityBadge = ({ priority }) => {
  // Define badge styles based on priority
  const badgeClass = `priority-badge-${priority}`;

  return (
    <span className={badgeClass} data-testid="priority-badge">
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

export default PriorityBadge;