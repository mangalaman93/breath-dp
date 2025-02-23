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

export default function Home() {
  const [imageState, setImageState] = useState<ImageState>({
    frames: [],
    isLoading: false,
  });

  const processImage = async (file: File): Promise<Frame[]> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = async () => {
        const [canvas, ctx] = createCanvas(800, 800);

        // Calculate scaling to fit image within the frame's empty space
        const framePadding = 50; // Adjust based on your frame's empty space
        const maxWidth = canvas.width - framePadding * 2;
        const maxHeight = canvas.height - framePadding * 2;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        // Draw the user-uploaded image first
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        // Frame 1: breath-frame
        const breathFrame = document.createElement('img');
        await new Promise<void>((resolve) => {
          breathFrame.onload = () => resolve();
          breathFrame.src = '/breath-frame.png';
        });
        ctx.drawImage(breathFrame, 0, 0, canvas.width, canvas.height);
        const frame1 = {
          dataUrl: canvas.toDataURL('image/png'),
          name: 'breath-dp.png',
        };

        // Frame 2: shwas-frame
        const shwasFrame = document.createElement('img');
        await new Promise<void>((resolve) => {
          shwasFrame.onload = () => resolve();
          shwasFrame.src = '/shwas-frame.png';
        });
        ctx.drawImage(shwasFrame, 0, 0, canvas.width, canvas.height);
        const frame2 = {
          dataUrl: canvas.toDataURL('image/png'),
          name: 'shwas-dp.png',
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
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">DP Generator</h1>

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
                  {index === 0 ? 'Breath Frame' : 'Shwas Frame'}
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
