'use client';

import { useState } from 'react';
import Image from 'next/image';

type Frame = {
  dataUrl: string;
  name: string;
};

type ImageState = {
  frames: Frame[];
  isLoading: boolean;
};

// Canvas utility functions
const createCanvas = (
  width: number,
  height: number
): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;
  return [canvas, ctx];
};

const drawGradientFrame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f0f9ff');
  gradient.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add header background
  const headerGradient = ctx.createLinearGradient(0, 0, width, 120);
  headerGradient.addColorStop(0, '#3b82f6');
  headerGradient.addColorStop(1, '#2563eb');
  ctx.fillStyle = headerGradient;
  ctx.fillRect(0, 0, width, 120);

  // Add decorative line under header
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 110);
  ctx.lineTo(width - 40, 110);
  ctx.stroke();

  // Add header text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BREATH DP', width / 2, 60);

  // Add decorative circles with gradient
  const circle1Gradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 80);
  circle1Gradient.addColorStop(0, 'rgba(191, 219, 254, 0.4)');
  circle1Gradient.addColorStop(1, 'rgba(191, 219, 254, 0.1)');
  ctx.fillStyle = circle1Gradient;
  ctx.beginPath();
  ctx.arc(100, 100, 80, 0, Math.PI * 2);
  ctx.fill();

  const circle2Gradient = ctx.createRadialGradient(
    width - 100,
    height - 100,
    0,
    width - 100,
    height - 100,
    120
  );
  circle2Gradient.addColorStop(0, 'rgba(191, 219, 254, 0.4)');
  circle2Gradient.addColorStop(1, 'rgba(191, 219, 254, 0.1)');
  ctx.fillStyle = circle2Gradient;
  ctx.beginPath();
  ctx.arc(width - 100, height - 100, 120, 0, Math.PI * 2);
  ctx.fill();

  // Add subtle texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < width; i += 20) {
    for (let j = 150; j < height; j += 20) {
      if (Math.random() > 0.5) {
        ctx.fillRect(i, j, 2, 2);
      }
    }
  }
};

const drawPatternFrame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Modern dot pattern
  ctx.fillStyle = '#f1f5f9';
  for (let x = 0; x < width; x += 30) {
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Subtle border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, width - 20, height - 20);
};

export default function Home() {
  const [imageState, setImageState] = useState<ImageState>({
    frames: [],
    isLoading: false,
  });

  const processImage = async (file: File): Promise<Frame[]> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        const [canvas, ctx] = createCanvas(800, 800);

        // Calculate scaling to fit image within 700x700 (leaving room for decoration)
        const scale = Math.min(600 / img.width, 600 / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (800 - scaledWidth) / 2;
        const y = (800 - scaledHeight) / 2 + 60; // Move image down to accommodate header

        // Frame 1: Gradient background
        drawGradientFrame(ctx, canvas.width, canvas.height);
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 15;
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        const frame1 = {
          dataUrl: canvas.toDataURL('image/png'),
          name: 'breath-dp-gradient.png',
        };

        // Reset shadow and create Frame 2: Pattern background
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        drawPatternFrame(ctx, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        const frame2 = {
          dataUrl: canvas.toDataURL('image/png'),
          name: 'breath-dp-pattern.png',
        };

        resolve([frame1, frame2]);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageState((prev) => ({ ...prev, isLoading: true }));

    try {
      const frames = await processImage(file);
      setImageState({ frames, isLoading: false });
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
      setImageState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDownload = async (frame: Frame) => {
    try {
      const link = document.createElement('a');
      link.href = frame.dataUrl;
      link.download = frame.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Breath DP Generator</h1>

        <div className="flex flex-col items-center gap-8">
          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl">
            Upload Image
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={imageState.isLoading}
            />
          </label>

          {imageState.isLoading && (
            <div className="text-center text-gray-600">
              <p>Processing image...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {imageState.frames.map((frame, index) => (
              <div
                key={index}
                className="border border-gray-200 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  {index === 0 ? 'Gradient Frame' : 'Pattern Frame'}
                </h2>
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={frame.dataUrl}
                    alt={`Frame ${index + 1}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <button
                  onClick={() => handleDownload(frame)}
                  className="mt-4 w-full bg-green-500 hover:bg-green-600 transition-colors duration-200 text-white px-6 py-3 rounded-lg shadow hover:shadow-lg"
                >
                  Download Frame
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
