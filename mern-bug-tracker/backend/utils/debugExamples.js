/**
 * This file contains intentional bugs for learning debugging techniques
 */
const logger = require('../config/logger');

/**
 * Bug 1: Array Index Out of Bounds
 * This function has an off-by-one error in the loop
 */
const calculateTotalPriority = (bugs) => {
  let priorityScores = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'critical': 5
  };
  
  let total = 0;
  
  // Bug: <= should be < (will cause index out of bounds)
  for (let i = 0; i <= bugs.length; i++) {
    logger.debug(`Processing bug ${i}`);
    const bug = bugs[i];
    total += priorityScores[bug.priority] || 0;
  }
  
  return total;
};

/**
 * Bug 2: Undefined Property Access
 * This function doesn't check if the bug has the required property
 */
const getResolvedTime = (bug) => {
  // Bug: doesn't check if resolvedAt exists
  const resolvedAt = bug.resolvedAt;
  const createdAt = bug.createdAt;
  
  // Calculate time difference in hours
  return Math.round((resolvedAt - createdAt) / (1000 * 60 * 60));
};

/**
 * Bug 3: Asynchronous Error Handling
 * This function doesn't properly handle Promise rejections
 */
const updateBugStatus = async (bugId, newStatus) => {
  // Bug: Missing try/catch block
  const response = await fetch(`/api/bugs/${bugId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  
  if (!response.ok) {
    // This will never execute if fetch throws an error
    logger.error('Failed to update bug status');
  }
  
  return response.json();
};

/**
 * Bug 4: Logical Error in Calculation
 * This function has incorrect logic for calculating the bug fix time
 */
const calculateAverageBugFixTime = (bugs) => {
  let totalTime = 0;
  let count = 0;
  
  bugs.forEach(bug => {
    if (bug.status === 'resolved' || bug.status === 'closed') {
      const fixTime = getResolvedTime(bug);
      
      // Bug: Logic error - should be +=
      totalTime = fixTime;
      count++;
    }
  });
  
  // Bug: Doesn't handle divide by zero
  return totalTime / count;
};

/**
 * Bug 5: Memory Leak
 * This closure keeps references to large objects
 */
const createBugAnalyzer = () => {
  // This array will grow unbounded
  const processedBugs = [];
  
  return {
    analyze: (bug) => {
      // Process the bug
      const result = {
        id: bug._id,
        title: bug.title,
        severity: calculateSeverity(bug),
        // Stores the ENTIRE bug object, causing memory bloat
        originalBug: bug
      };
      
      // Bug: Keeps adding to the array without any limit
      processedBugs.push(result);
      
      return result;
    },
    
    getProcessedCount: () => processedBugs.length
  };
};

// Helper function
const calculateSeverity = (bug) => {
  const priorityScores = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'critical': 5
  };
  
  const ageInDays = (new Date() - new Date(bug.createdAt)) / (1000 * 60 * 60 * 24);
  
  return priorityScores[bug.priority] * (ageInDays > 7 ? 1.5 : 1);
};

module.exports = {
  calculateTotalPriority,
  getResolvedTime,
  updateBugStatus,
  calculateAverageBugFixTime,
  createBugAnalyzer
};