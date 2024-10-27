import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Register from '../pages/register';
import { useRouter } from 'next/router';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock alert
global.alert = jest.fn();

describe('Register Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should render the registration form', () => {
    render(<Register />);

    // Check if email, password input, and role dropdown are present
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Submitter')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument(); // Target the button by role
  });

  it('should display an error when registration fails', async () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({ push: mockPush }));
  
    // Mock fetch to simulate a failed registration
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Username has been used' }),
      })
    );
  
    render(<Register />);
  
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
  
    // Wait for the fetch to complete
    await new Promise((r) => setTimeout(r, 500)); // Small delay to ensure the fetch has resolved
  
    // Check that alert was called
    expect(global.alert).toHaveBeenCalledWith('Registration failed, username has been used');
  });
  
  it('should redirect after successful registration', async () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({ push: mockPush }));
  
    // Mock fetch to simulate a successful registration
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
  
    render(<Register />);
  
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
  
    // Wait for the fetch to complete
    await new Promise((r) => setTimeout(r, 500)); // Small delay to ensure the fetch has resolved
  
    // Check that the router was pushed to the login page
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
  
  
});
