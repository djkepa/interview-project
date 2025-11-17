/**
 * Integration tests for ImagePreview component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ImagePreview } from '@/components/ImageUpload/ImagePreview';

// Mock next/image properly
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, ...props }: Record<string, unknown>) => {
    return (
      <img
        src={src as string}
        alt={alt as string}
        onLoad={onLoad as () => void}
        data-testid="next-image"
        {...props}
      />
    );
  },
}));

describe('ImagePreview Component', () => {
  const testSrc = 'data:image/png;base64,test123';

  it('should render with loading skeleton initially', () => {
    render(<ImagePreview src={testSrc} />);

    // Skeleton should be visible
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('should hide skeleton and show image after load', async () => {
    render(<ImagePreview src={testSrc} alt="Test Image" />);

    const image = screen.getByTestId('next-image');

    // Simulate image load
    if (image && typeof (image as HTMLImageElement).onload === 'function') {
      (image as HTMLImageElement).onload?.(new Event('load'));
    }

    await waitFor(() => {
      expect(image).toHaveClass('block');
    });
  });

  it('should render with correct image src', () => {
    render(<ImagePreview src={testSrc} />);

    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('src', testSrc);
  });

  it('should use default alt text when not provided', () => {
    render(<ImagePreview src={testSrc} />);

    const image = screen.getByAltText('Preview');
    expect(image).toBeInTheDocument();
  });

  it('should use custom alt text when provided', () => {
    render(<ImagePreview src={testSrc} alt="Custom Alt" />);

    const image = screen.getByAltText('Custom Alt');
    expect(image).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    const { container } = render(<ImagePreview src={testSrc} />);

    const wrapper = container.querySelector('.mt-4');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('mt-4');
  });
});
