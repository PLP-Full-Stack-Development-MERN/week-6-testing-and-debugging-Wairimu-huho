import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', error.response || error);
    }
    
    // Return a standardized error format
    return Promise.reject({
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || [],
      isApiError: true,
    });
  }
);

// Bug API endpoints
export const bugApi = {
  // Get all bugs with optional filtering
  getBugs: async (params = {}) => {
    return api.get('/bugs', { params });
  },
  
  // Get a single bug by ID
  getBugById: async (id) => {
    return api.get(`/bugs/${id}`);
  },
  
  // Create a new bug
  createBug: async (bugData) => {
    return api.post('/bugs', bugData);
  },
  
  // Update a bug
  updateBug: async (id, bugData) => {
    return api.put(`/bugs/${id}`, bugData);
  },
  
  // Delete a bug
  deleteBug: async (id) => {
    return api.delete(`/bugs/${id}`);
  },
  
  // Get bug statistics
  getBugStats: async () => {
    return api.get('/bugs/stats');
  },
};

export default api;