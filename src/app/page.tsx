'use client';

import { useState } from 'react';
import Image from 'next/image';

type ImageState = {
  url: string | null;
  processed: string[];
  isLoading: boolean;
};

export default function Home() {
  const [imageState, setImageState] = useState<ImageState>({
    url: null,
    processed: [],
    isLoading: false,
  });

  const processImage = async (file: File): Promise<string[]> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        // Create canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Set canvas size to 800x800
        canvas.width = 800;
        canvas.height = 800;

        // Calculate scaling to fit image within 800x800 while maintaining aspect ratio
        const scale = Math.min(800 / img.width, 800 / img.height);
        const x = (800 - img.width * scale) / 2;
        const y = (800 - img.height * scale) / 2;

        // Process frames
        const frames: string[] = [];

        // Frame 1: White background with centered image
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 800, 800);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        frames.push(canvas.toDataURL('image/png'));

        // Frame 2: White background with image at top
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 800, 800);
        ctx.drawImage(img, x, 0, img.width * scale, img.height * scale);
        frames.push(canvas.toDataURL('image/png'));

        // Frame 3: White background with image at bottom
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 800, 800);
        ctx.drawImage(img, x, 800 - img.height * scale, img.width * scale, img.height * scale);
        frames.push(canvas.toDataURL('image/png'));

        resolve(frames);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageState((prev) => ({ ...prev, isLoading: true }));

    try {
      const processedImages = await processImage(file);
      setImageState({
        url: URL.createObjectURL(file),
        processed: processedImages,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
      setImageState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDownload = async (dataUrl: string, filename: string) => {
    try {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Breath DP Generator</h1>

        <div className="flex flex-col items-center gap-8">
          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
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
            <div className="text-center">
              <p>Processing image...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {imageState.url && (
              <div className="border p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Original Image</h2>
                <div className="relative aspect-square">
                  <Image
                    src={imageState.url}
                    alt="Original image"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <button
                  onClick={() => handleDownload(imageState.url!, 'original.png')}
                  className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Download Original
                </button>
              </div>
            )}

            {imageState.processed.map((image, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Frame {index + 1}</h2>
                <div className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`Frame ${index + 1}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <button
                  onClick={() => handleDownload(image, `breath-dp${index + 1}.png`)}
                  className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Download Frame {index + 1}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
