/**
 * Integration tests for ImageUploadForm component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUploadForm } from '@/components/ImageUpload/ImageUploadForm';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, ...props }: Record<string, unknown>) => (
    <img
      src={src as string}
      alt={alt as string}
      onLoad={onLoad as () => void}
      data-testid="next-image"
      {...props}
    />
  ),
}));

describe('ImageUploadForm Component', () => {
  const mockProps = {
    imagePreview: null,
    isUploading: false,
    hasImageFile: false,
    fileInputRef: React.createRef<HTMLInputElement>(),
    onImageChange: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render file input', () => {
    render(<ImageUploadForm {...mockProps} />);

    const fileInput = screen.getByLabelText(/choose file/i);
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  it('should render upload button in disabled state initially', () => {
    render(<ImageUploadForm {...mockProps} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should enable upload button when file is selected', () => {
    render(<ImageUploadForm {...mockProps} hasImageFile={true} />);

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should call onImageChange when file is selected', () => {
    render(<ImageUploadForm {...mockProps} />);

    const fileInput = screen.getByLabelText(/choose file/i);
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockProps.onImageChange).toHaveBeenCalled();
  });

  it('should call onSubmit when form is submitted', () => {
    render(<ImageUploadForm {...mockProps} hasImageFile={true} />);

    const form = screen.getByRole('button').closest('form');
    if (form) {
      fireEvent.submit(form);
      expect(mockProps.onSubmit).toHaveBeenCalled();
    }
  });

  it('should show preview when imagePreview is provided', () => {
    render(
      <ImageUploadForm
        {...mockProps}
        imagePreview="data:image/png;base64,test"
        hasImageFile={true}
      />
    );

    const preview = screen.getByTestId('next-image');
    expect(preview).toBeInTheDocument();
  });

  it('should show "Uploading..." text when uploading', () => {
    render(
      <ImageUploadForm
        {...mockProps}
        isUploading={true}
        hasImageFile={true}
        imagePreview="data:image/png;base64,test"
      />
    );

    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
  });

  it('should not show preview when no imagePreview', () => {
    render(<ImageUploadForm {...mockProps} />);

    const preview = screen.queryByTestId('next-image');
    expect(preview).not.toBeInTheDocument();
  });
});
