/**
 * Integration tests for UploadSuccess component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UploadSuccess } from '@/components/ImageUpload/UploadSuccess';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, ...props }: Record<string, unknown>) => (
    <img
      src={src as string}
      alt={alt as string}
      onLoad={onLoad as () => void}
      data-testid="uploaded-image"
      {...props}
    />
  ),
}));

describe('UploadSuccess Component', () => {
  const mockImageUrl = '/api/uploads/test-image-123.png';
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render success message', () => {
    render(<UploadSuccess imageUrl={mockImageUrl} onReset={mockOnReset} />);

    expect(screen.getByText(/upload successful/i)).toBeInTheDocument();
  });

  it('should render uploaded image', () => {
    render(<UploadSuccess imageUrl={mockImageUrl} onReset={mockOnReset} />);

    const image = screen.getByTestId('uploaded-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockImageUrl);
  });

  it('should render "Upload Another" button', () => {
    render(<UploadSuccess imageUrl={mockImageUrl} onReset={mockOnReset} />);

    const button = screen.getByRole('button', { name: /upload another/i });
    expect(button).toBeInTheDocument();
  });

  it('should call onReset when "Upload Another" button is clicked', () => {
    render(<UploadSuccess imageUrl={mockImageUrl} onReset={mockOnReset} />);

    const button = screen.getByRole('button', { name: /upload another/i });
    fireEvent.click(button);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('should render link to view full image', () => {
    render(<UploadSuccess imageUrl={mockImageUrl} onReset={mockOnReset} />);

    const link = screen.getByRole('link', { name: /view full image/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', mockImageUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should show loading skeleton initially', () => {
    const { container } = render(<UploadSuccess imageUrl={mockImageUrl} onReset={mockOnReset} />);

    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('should have success styling', () => {
    const { container } = render(<UploadSuccess imageUrl={mockImageUrl} onReset={mockOnReset} />);

    const successDiv = container.querySelector('.bg-gradient-to-r');
    expect(successDiv).toBeInTheDocument();
  });
});
