'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process image');

      const data = await response.json();
      setProcessedImages(data.processedImages);
      setUploadedImage(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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
              disabled={isLoading}
            />
          </label>

          {isLoading && (
            <div className="text-center">
              <p>Processing image...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {uploadedImage && (
              <div className="border p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Original Image</h2>
                <div className="relative aspect-square">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded image"
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => handleDownload(uploadedImage, 'original.jpg')}
                  className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Download Original
                </button>
              </div>
            )}

            {processedImages.map((image, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Frame {index + 1}</h2>
                <div className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`Frame ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => handleDownload(image, `frame-${index + 1}.jpg`)}
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
