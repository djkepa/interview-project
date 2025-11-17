// app/api/health/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Health check endpoint
 *
 * Purpose:
 * - Provides a simple endpoint for Docker healthchecks and monitoring
 * - Validates that critical directories exist and are writable
 * - Returns system status for operational monitoring
 *
 * Used by:
 * - Docker Compose healthcheck
 * - Kubernetes liveness/readiness probes
 * - External monitoring tools
 */
export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');

    // Check if uploads directory exists and is accessible
    const uploadsDirExists = fs.existsSync(uploadsDir);

    // Check if directory is writable
    let isWritable = false;
    if (uploadsDirExists) {
      try {
        fs.accessSync(uploadsDir, fs.constants.W_OK);
        isWritable = true;
      } catch {
        isWritable = false;
      }
    }

    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        uploadsDirectory: {
          exists: uploadsDirExists,
          writable: isWritable,
        },
      },
    };

    // If critical checks fail, return unhealthy status
    if (!uploadsDirExists || !isWritable) {
      return NextResponse.json(
        {
          ...status,
          status: 'unhealthy',
          message: 'Uploads directory is not accessible or writable',
        },
        { status: 503 },
      );
    }

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    );
  }
}
