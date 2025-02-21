import { NextRequest, NextResponse } from 'next/server';
import * as sharp from 'sharp';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a white background image
    const whiteBackground = await sharp({
      create: {
        width: 800,
        height: 800,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    }).png().toBuffer();

    // Process frame 1
    const frame1 = await sharp(buffer)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .composite([
        {
          input: whiteBackground,
          blend: 'dest-over'
        },
        {
          input: path.join(process.cwd(), 'public', 'frame1.png'),
          blend: 'over'
        }
      ])
      .png()
      .toBuffer();

    // Process frame 2
    const frame2 = await sharp(buffer)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .composite([
        {
          input: whiteBackground,
          blend: 'dest-over'
        },
        {
          input: path.join(process.cwd(), 'public', 'frame2.png'),
          blend: 'over'
        }
      ])
      .png()
      .toBuffer();

    // Convert buffers to base64 strings
    const frame1Base64 = `data:image/png;base64,${frame1.toString('base64')}`;
    const frame2Base64 = `data:image/png;base64,${frame2.toString('base64')}`;

    // Return the base64 encoded images
    return NextResponse.json({
      processedImages: [frame1Base64, frame2Base64]
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
