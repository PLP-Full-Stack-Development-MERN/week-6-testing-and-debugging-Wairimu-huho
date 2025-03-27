import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from './StatusBadge';

describe('StatusBadge Component', () => {
  it('renders open status badge correctly', () => {
    render(<StatusBadge status="open" />);
    const badge = screen.getByTestId('status-badge');
    
    expect(badge).toHaveTextContent('Open');
    expect(badge).toHaveClass('status-badge-open');
  });
  
  it('renders in-progress status badge correctly', () => {
    render(<StatusBadge status="in-progress" />);
    const badge = screen.getByTestId('status-badge');
    
    expect(badge).toHaveTextContent('In Progress');
    expect(badge).toHaveClass('status-badge-in-progress');
  });
  
  it('renders resolved status badge correctly', () => {
    render(<StatusBadge status="resolved" />);
    const badge = screen.getByTestId('status-badge');
    
    expect(badge).toHaveTextContent('Resolved');
    expect(badge).toHaveClass('status-badge-resolved');
  });
  
  it('renders closed status badge correctly', () => {
    render(<StatusBadge status="closed" />);
    const badge = screen.getByTestId('status-badge');
    
    expect(badge).toHaveTextContent('Closed');
    expect(badge).toHaveClass('status-badge-closed');
  });
  
  it('handles undefined or empty status gracefully', () => {
    render(<StatusBadge status="" />);
    const badge = screen.getByTestId('status-badge');
    
    expect(badge).toHaveTextContent('');
  });
});