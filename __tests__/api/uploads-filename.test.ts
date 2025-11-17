/**
 * Unit tests for dynamic file serving endpoint
 */

import { GET } from '@/app/api/uploads/[filename]/route';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('path');

describe('GET /api/uploads/[filename]', () => {
  const mockFilename = 'test-image.png';

  beforeEach(() => {
    jest.clearAllMocks();
    (path.join as jest.Mock).mockReturnValue(`/uploads/${mockFilename}`);
    (path.extname as jest.Mock).mockReturnValue('.png');
  });

  it('should return image when file exists', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('fake-image-data'));

    const response = await GET(
      {} as Request,
      { params: Promise.resolve({ filename: mockFilename }) }
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });

  it('should return 404 when file not found', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const response = await GET(
      {} as Request,
      { params: Promise.resolve({ filename: mockFilename }) }
    );

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error).toContain('not found');
  });

  it('should reject path traversal attempts with ..', async () => {
    const response = await GET(
      {} as Request,
      { params: Promise.resolve({ filename: '../etc/passwd' }) }
    );

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('Invalid filename');
  });

  it('should reject path traversal attempts with /', async () => {
    const response = await GET(
      {} as Request,
      { params: Promise.resolve({ filename: 'test/../../etc/passwd' }) }
    );

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('Invalid filename');
  });

  it('should reject path traversal attempts with backslash', async () => {
    const response = await GET(
      {} as Request,
      { params: Promise.resolve({ filename: 'test\\..\\passwd' }) }
    );

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('Invalid filename');
  });

  it('should set correct Content-Type for different file types', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('fake-image-data'));

    // Test JPEG
    (path.extname as jest.Mock).mockReturnValue('.jpg');
    const jpgResponse = await GET(
      {} as Request,
      { params: Promise.resolve({ filename: 'test.jpg' }) }
    );
    expect(jpgResponse.headers.get('Content-Type')).toBe('image/jpeg');

    // Test GIF
    (path.extname as jest.Mock).mockReturnValue('.gif');
    const gifResponse = await GET(
      {} as Request,
      { params: Promise.resolve({ filename: 'test.gif' }) }
    );
    expect(gifResponse.headers.get('Content-Type')).toBe('image/gif');
  });

  it('should set cache headers', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('fake-image-data'));

    const response = await GET(
      {} as Request,
      { params: Promise.resolve({ filename: mockFilename }) }
    );

    expect(response.headers.get('Cache-Control')).toBeTruthy();
  });
});

