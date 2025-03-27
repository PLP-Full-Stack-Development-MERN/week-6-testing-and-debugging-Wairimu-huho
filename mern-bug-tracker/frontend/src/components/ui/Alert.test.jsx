import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Alert from './Alert';

describe('Alert Component', () => {
  it('renders success alert correctly', () => {
    render(<Alert type="success" message="Operation successful" />);
    const alert = screen.getByTestId('alert');
    
    expect(alert).toHaveTextContent('Operation successful');
    expect(alert).toHaveClass('bg-green-50');
  });
  
  it('renders error alert correctly', () => {
    render(<Alert type="error" message="Operation failed" />);
    const alert = screen.getByTestId('alert');
    
    expect(alert).toHaveTextContent('Operation failed');
    expect(alert).toHaveClass('bg-red-50');
  });
  
  it('renders warning alert correctly', () => {
    render(<Alert type="warning" message="Proceed with caution" />);
    const alert = screen.getByTestId('alert');
    
    expect(alert).toHaveTextContent('Proceed with caution');
    expect(alert).toHaveClass('bg-yellow-50');
  });
  
  it('renders info alert correctly', () => {
    render(<Alert type="info" message="For your information" />);
    const alert = screen.getByTestId('alert');
    
    expect(alert).toHaveTextContent('For your information');
    expect(alert).toHaveClass('bg-blue-50');
  });
  
  it('renders nothing when message is empty', () => {
    const { container } = render(<Alert type="info" message="" />);
    expect(container).toBeEmptyDOMElement();
  });
  
  it('calls onDismiss when dismiss button is clicked', () => {
    const handleDismiss = vi.fn();
    render(
      <Alert 
        type="info" 
        message="Dismissible alert" 
        dismissible={true} 
        onDismiss={handleDismiss} 
      />
    );
    
    const dismissButton = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissButton);
    
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
  
  it('does not show dismiss button when dismissible is false', () => {
    render(<Alert type="info" message="Non-dismissible alert" />);
    
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });
});