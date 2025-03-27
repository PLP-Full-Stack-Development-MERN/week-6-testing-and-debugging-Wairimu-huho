import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import BugForm from './BugForm';
import { bugApi } from '../../services/api';

// Mock the API and navigation
vi.mock('../../services/api', () => ({
  bugApi: {
    createBug: vi.fn(),
    updateBug: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Helper to render with router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('BugForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form in create mode correctly', () => {
    renderWithRouter(<BugForm />);
    
    // Check if form title is correct
    expect(screen.getByText('Report New Bug')).toBeInTheDocument();
    
    // Check if required fields are marked
    expect(screen.getByText('Bug Title *')).toBeInTheDocument();
    expect(screen.getByText('Description *')).toBeInTheDocument();
    
    // Check if submit button has correct text
    expect(screen.getByTestId('submit-bug-button')).toHaveTextContent('Create Bug');
  });

  it('renders form in edit mode correctly', () => {
    const mockBug = {
      _id: '123',
      title: 'Test Bug',
      description: 'Test Description',
      status: 'open',
      priority: 'medium',
      reportedBy: 'Test User',
      project: 'Test Project',
    };
    
    renderWithRouter(<BugForm bug={mockBug} />);
    
    // Check if form title is correct
    expect(screen.getByText('Edit Bug')).toBeInTheDocument();
    
    // Check if fields are pre-populated
    expect(screen.getByTestId('bug-title-input')).toHaveValue('Test Bug');
    expect(screen.getByTestId('bug-description-input')).toHaveValue('Test Description');
    
    // Check if submit button has correct text
    expect(screen.getByTestId('submit-bug-button')).toHaveTextContent('Update Bug');
  });

  it('validates required fields', async () => {
    renderWithRouter(<BugForm />);
    
    // Submit form without filling required fields
    fireEvent.click(screen.getByTestId('submit-bug-button'));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toBeInTheDocument();
    });
    
    // Make sure API wasn't called
    expect(bugApi.createBug).not.toHaveBeenCalled();
  });

  it('submits form in create mode', async () => {
    // Mock successful API response
    bugApi.createBug.mockResolvedValue({
      success: true,
      data: { _id: 'new-bug-id' },
    });
    
    const onSuccess = vi.fn();
    renderWithRouter(<BugForm onSuccess={onSuccess} />);
    
    // Fill out form
    fireEvent.change(screen.getByTestId('bug-title-input'), {
      target: { value: 'New Bug Title' },
    });
    fireEvent.change(screen.getByTestId('bug-description-input'), {
      target: { value: 'New Bug Description' },
    });
    fireEvent.change(screen.getByLabelText('Project *'), {
      target: { value: 'Test Project' },
    });
    fireEvent.change(screen.getByLabelText('Reported By *'), {
      target: { value: 'Test User' },
    });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-bug-button'));
    
    // Check if API was called with correct data
    await waitFor(() => {
      expect(bugApi.createBug).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Bug Title',
        description: 'New Bug Description',
        project: 'Test Project',
        reportedBy: 'Test User',
      }));
      
      // Check if success callback was called
      expect(onSuccess).toHaveBeenCalled();
      
      // Check if success message is displayed
      expect(screen.getByText('Bug created successfully!')).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    // Mock API error
    const apiError = {
      message: 'Validation failed',
      isApiError: true,
      errors: [
        { field: 'title', message: 'Title is already in use' }
      ]
    };
    bugApi.createBug.mockRejectedValue(apiError);
    
    renderWithRouter(<BugForm />);
    
    // Fill out form
    fireEvent.change(screen.getByTestId('bug-title-input'), {
      target: { value: 'New Bug Title' },
    });
    fireEvent.change(screen.getByTestId('bug-description-input'), {
      target: { value: 'New Bug Description' },
    });
    fireEvent.change(screen.getByLabelText('Project *'), {
      target: { value: 'Test Project' },
    });
    fireEvent.change(screen.getByLabelText('Reported By *'), {
      target: { value: 'Test User' },
    });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-bug-button'));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Validation failed')).toBeInTheDocument();
    });
  });
});