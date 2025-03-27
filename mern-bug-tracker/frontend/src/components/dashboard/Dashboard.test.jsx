import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { bugApi } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  bugApi: {
    getBugStats: vi.fn(),
  },
}));

// Helper to render with router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Dashboard Component', () => {
  // Mock data for statistics
  const mockStats = {
    status: [
      { _id: 'open', count: 10 },
      { _id: 'in-progress', count: 5 },
      { _id: 'resolved', count: 3 },
      { _id: 'closed', count: 2 },
    ],
    priority: [
      { _id: 'low', count: 4 },
      { _id: 'medium', count: 8 },
      { _id: 'high', count: 6 },
      { _id: 'critical', count: 2 },
    ],
    projects: [
      { _id: 'Project A', count: 8 },
      { _id: 'Project B', count: 7 },
      { _id: 'Project C', count: 5 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response
    bugApi.getBugStats.mockResolvedValue({
      success: true,
      data: mockStats,
    });
  });

  it('renders loading state initially', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Loading dashboard statistics...')).toBeInTheDocument();
  });

  it('renders dashboard with statistics after loading', async () => {
    renderWithRouter(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard statistics...')).not.toBeInTheDocument();
    });
    
    // Check if dashboard title is rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Check if total bugs count is rendered
    expect(screen.getByText('20')).toBeInTheDocument(); // 10 + 5 + 3 + 2 = 20
    
    // Check if open bugs count is rendered
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Check if status bars are rendered
    expect(screen.getByTestId('status-bar-open')).toBeInTheDocument();
    expect(screen.getByTestId('status-bar-in-progress')).toBeInTheDocument();
    
    // Check if priority bars are rendered
    expect(screen.getByTestId('priority-bar-high')).toBeInTheDocument();
    expect(screen.getByTestId('priority-bar-critical')).toBeInTheDocument();
    
    // Check if projects table is rendered
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  it('renders error message when API call fails', async () => {
    // Mock API error
    bugApi.getBugStats.mockRejectedValue({
      message: 'Failed to fetch statistics',
    });
    
    renderWithRouter(<Dashboard />);
    
    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch statistics')).toBeInTheDocument();
    });
  });

  it('renders quick action buttons', async () => {
    renderWithRouter(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard statistics...')).not.toBeInTheDocument();
    });
    
    // Check if quick action buttons are rendered
    expect(screen.getByTestId('report-bug-button')).toBeInTheDocument();
    expect(screen.getByTestId('view-bugs-button')).toBeInTheDocument();
  });
});