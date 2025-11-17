/**
 * Integration tests for upload-image endpoint - testing actual implementation
 */

import { POST } from '@/app/api/upload-image/route';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('path');

describe('POST /api/upload-image - Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (path.join as jest.Mock).mockReturnValue('/mock/uploads/path');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => undefined);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => undefined);
  });

  it('should successfully upload valid image', async () => {
    const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
    const mockFormData = new FormData();
    mockFormData.append('image', mockFile);

    const request = new Request('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: mockFormData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.imagePath).toContain('/api/uploads/');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should reject file without image in form data', async () => {
    const emptyFormData = new FormData();

    const request = new Request('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: emptyFormData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('No image');
  });

  it('should reject oversized files', async () => {
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.png', {
      type: 'image/png',
      size: 11 * 1024 * 1024,
    });

    mockFormData.set('image', largeFile);

    const request = new Request('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: mockFormData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('size');
  });

  it('should reject invalid file types', async () => {
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const mockFormData = new FormData();
    mockFormData.append('image', invalidFile);

    const request = new Request('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: mockFormData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('type');
  });

  it('should create uploads directory if not exists', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockFormData = new FormData();
    mockFormData.append('image', mockFile);

    const request = new Request('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: mockFormData,
    });

    await POST(request);

    expect(fs.mkdirSync).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ recursive: true })
    );
  });

  it('should handle file write errors gracefully', async () => {
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Disk full');
    });

    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockFormData = new FormData();
    mockFormData.append('image', mockFile);

    const request = new Request('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: mockFormData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });

  it('should generate unique filenames with timestamp', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockFormData = new FormData();
    mockFormData.append('image', mockFile);

    const request = new Request('http://localhost:3000/api/upload-image', {
      method: 'POST',
      body: mockFormData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.imagePath).toMatch(/image-\d+\.png$/);
  });

  it('should accept all valid image MIME types', async () => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    for (const type of validTypes) {
      jest.clearAllMocks();
      const file = new File(['test'], `test.${type.split('/')[1]}`, { type });
      const mockFormData = new FormData();
      mockFormData.append('image', file);

      const request = new Request('http://localhost:3000/api/upload-image', {
        method: 'POST',
        body: mockFormData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    }
  });
});
