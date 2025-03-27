/**
 * Format API errors for display in forms
 * @param {Object} apiError - Error returned from API
 * @returns {Object} Error messages keyed by field name
 */
export const formatApiErrors = (apiError) => {
    if (!apiError || !apiError.errors || !apiError.errors.length) {
      return {};
    }
  
    return apiError.errors.reduce((acc, error) => {
      if (error.field) {
        acc[error.field] = error.message;
      }
      return acc;
    }, {});
  };
  
  /**
   * Set form errors from API response
   * @param {Object} error - API error response
   * @param {Function} setError - React Hook Form setError function
   */
  export const setFormErrors = (error, setError) => {
    if (error?.isApiError && error.errors) {
      error.errors.forEach((err) => {
        if (err.field) {
          setError(err.field, {
            type: 'server',
            message: err.message,
          });
        }
      });
    }
  };
  
  /**
   * Form validation rules for bug form
   */
  export const bugValidationRules = {
    title: {
      required: 'Bug title is required',
      maxLength: {
        value: 100,
        message: 'Title cannot be more than 100 characters',
      },
    },
    description: {
      required: 'Bug description is required',
      maxLength: {
        value: 1000,
        message: 'Description cannot be more than 1000 characters',
      },
    },
    status: {
      required: 'Status is required',
    },
    priority: {
      required: 'Priority is required',
    },
    reportedBy: {
      required: 'Reporter name is required',
    },
    project: {
      required: 'Project name is required',
    },
  };
  
  /**
   * Debounce function to limit how often a function can be called
   * @param {Function} func - Function to debounce
   * @param {number} wait - Milliseconds to wait
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait = 300) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };