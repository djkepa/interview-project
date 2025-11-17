/**
 * Unit tests for health check endpoint
 */

import { GET } from '@/app/api/health/route';
import fs from 'fs';

// Mock fs module
jest.mock('fs');

describe('GET /api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return healthy status when uploads directory exists and is writable', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.accessSync as jest.Mock).mockImplementation(() => {});

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.checks.uploadsDirectory.exists).toBe(true);
    expect(data.checks.uploadsDirectory.writable).toBe(true);
  });

  it('should return unhealthy status when uploads directory does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.checks.uploadsDirectory.exists).toBe(false);
  });

  it('should return unhealthy status when uploads directory is not writable', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.accessSync as jest.Mock).mockImplementation(() => {
      throw new Error('Permission denied');
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.checks.uploadsDirectory.exists).toBe(true);
    expect(data.checks.uploadsDirectory.writable).toBe(false);
  });

  it('should include timestamp and uptime in response', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.accessSync as jest.Mock).mockImplementation(() => {});

    const response = await GET();
    const data = await response.json();

    expect(data.timestamp).toBeDefined();
    expect(data.uptime).toBeDefined();
    expect(typeof data.timestamp).toBe('string');
    expect(typeof data.uptime).toBe('number');
  });

  it('should include environment in response', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.accessSync as jest.Mock).mockImplementation(() => {});

    const response = await GET();
    const data = await response.json();

    expect(data.environment).toBeDefined();
    expect(typeof data.environment).toBe('string');
  });

  it('should handle unexpected errors gracefully', async () => {
    (fs.existsSync as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected filesystem error');
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.error).toBeDefined();
  });
});
