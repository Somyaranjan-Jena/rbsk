import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Toast from '../components/Toast';

describe('Toast', () => {
  it('renders message text', () => {
    render(<Toast message="Test notification" type="success" onClose={() => {}} />);
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  it('renders error icon for error type', () => {
    const { container } = render(<Toast message="Error" type="error" onClose={() => {}} />);
    expect(container.querySelector('.bg-red-600')).toBeTruthy();
  });

  it('renders success style for success type', () => {
    const { container } = render(<Toast message="Done" type="success" onClose={() => {}} />);
    expect(container.querySelector('.bg-emerald-600')).toBeTruthy();
  });

  it('calls onClose when X button is clicked', () => {
    let closed = false;
    render(<Toast message="Click me" type="warning" onClose={() => { closed = true; }} />);
    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);
    expect(closed).toBe(true);
  });
});
