import { NextRequest, NextResponse } from 'next/server';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';
import { writeFile } from 'fs/promises';

// Function to ensure upload directory exists
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  return uploadDir;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir();

    // Generate unique filenames
    const timestamp = Date.now();
    const originalFilename = `original-${timestamp}.png`;
    const frame1Filename = `frame1-${timestamp}.png`;
    const frame2Filename = `frame2-${timestamp}.png`;

    // Save original image
    await writeFile(path.join(uploadDir, originalFilename), buffer);

    // Create frame images
    const frame1 = await sharp(buffer)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .composite([
        {
          input: path.join(process.cwd(), 'public', 'frame1.png'),
          blend: 'over'
        }
      ])
      .png()
      .toBuffer();

    const frame2 = await sharp(buffer)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .composite([
        {
          input: path.join(process.cwd(), 'public', 'frame2.png'),
          blend: 'over'
        }
      ])
      .png()
      .toBuffer();

    // Save frame images
    await writeFile(path.join(uploadDir, frame1Filename), frame1);
    await writeFile(path.join(uploadDir, frame2Filename), frame2);

    // Return the URLs of the processed images
    return NextResponse.json({
      processedImages: [
        `/uploads/${frame1Filename}`,
        `/uploads/${frame2Filename}`
      ]
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
