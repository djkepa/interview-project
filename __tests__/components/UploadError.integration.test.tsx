/**
 * Integration tests for UploadError component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { UploadError } from '@/components/ImageUpload/UploadError';

describe('UploadError Component', () => {
  it('should render error message', () => {
    const errorMessage = 'File is too large';
    render(<UploadError message={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render error icon SVG', () => {
    const { container } = render(<UploadError message="Test error" />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-6', 'w-6');
  });

  it('should have error styling with red gradient', () => {
    const { container } = render(<UploadError message="Test error" />);

    const errorDiv = container.querySelector('.from-red-500');
    expect(errorDiv).toBeInTheDocument();
  });

  it('should render different error messages', () => {
    const messages = ['File too large', 'Invalid file type', 'Network error', 'Upload failed'];

    messages.forEach((message) => {
      const { rerender } = render(<UploadError message={message} />);
      expect(screen.getByText(message)).toBeInTheDocument();
      rerender(<UploadError message="New message" />);
    });
  });

  it('should have proper container styling', () => {
    const { container } = render(<UploadError message="Test" />);

    const errorContainer = container.firstChild;
    expect(errorContainer).toHaveClass('mt-4', 'rounded-xl', 'p-4');
  });
});
