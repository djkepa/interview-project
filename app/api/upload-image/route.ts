// app/api/upload-image/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Image upload endpoint
 *
 * IMPORTANT CHANGES for Docker/Production compatibility:
 * - Files are now stored in /uploads (outside /public) to avoid Next.js static build conflicts
 * - Images are served via API endpoint (/api/uploads/[filename]) for consistent behavior
 * - Added file size validation and improved security
 *
 * Why not /public?
 * - Next.js production builds copy /public at BUILD TIME
 * - Runtime uploads to /public are not served by Next.js production server
 * - This causes 404s in Docker/production but works in dev mode
 */

// Configuration constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP',
        },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 },
      );
    }

    // Create a unique filename
    const uniqueId = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `image-${uniqueId}.${fileExtension}`;

    // Create the file path (outside /public for consistency across environments)
    const uploadsDir = path.join(process.cwd(), 'uploads');

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write the file to the uploads directory
    const fullPath = path.join(uploadsDir, fileName);
    fs.writeFileSync(fullPath, buffer);

    // Return the API path (not direct /public path)
    // This ensures consistent behavior in dev, Docker, and all environments
    return NextResponse.json({
      success: true,
      imagePath: `/api/uploads/${fileName}`,
      fileName: fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
