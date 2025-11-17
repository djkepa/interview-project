/**
 * Integration tests for useImageUpload hook
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useImageUpload } from '@/hooks/useImageUpload';

describe('useImageUpload Integration Tests', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useImageUpload());

    expect(result.current.imageFile).toBeNull();
    expect(result.current.imagePreview).toBeNull();
    expect(result.current.uploadedImageUrl).toBeNull();
    expect(result.current.isUploading).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('should handle image selection and generate preview', async () => {
    const { result } = renderHook(() => useImageUpload());

    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleImageChange(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.imageFile).toBe(mockFile);
      expect(result.current.imagePreview).toContain('data:image');
    });
  });

  it('should handle successful upload', async () => {
    const { result } = renderHook(() => useImageUpload());

    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleImageChange(mockEvent);
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, imagePath: '/api/uploads/test.png' }),
    });

    await act(async () => {
      await result.current.uploadImage({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    await waitFor(() => {
      expect(result.current.uploadedImageUrl).toBe('/api/uploads/test.png');
      expect(result.current.isUploading).toBe(false);
    });
  });

  it('should handle upload error', async () => {
    const { result } = renderHook(() => useImageUpload());

    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleImageChange(mockEvent);
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'Upload failed' }),
    });

    await act(async () => {
      await result.current.uploadImage({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBeTruthy();
      expect(result.current.uploadedImageUrl).toBeNull();
    });
  });

  it('should reset all state on resetUpload', async () => {
    const { result } = renderHook(() => useImageUpload());

    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleImageChange(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.imageFile).not.toBeNull();
    });

    act(() => {
      result.current.resetUpload();
    });

    expect(result.current.imageFile).toBeNull();
    expect(result.current.imagePreview).toBeNull();
    expect(result.current.uploadedImageUrl).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });
});
