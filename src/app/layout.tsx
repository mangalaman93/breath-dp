import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DP Generator',
  description: 'Generate beautifully framed images with elegant borders',
  applicationName: 'DP Generator',
  authors: [{ name: 'DP Generator Team' }],
  keywords: ['image', 'frame', 'generator', 'photo', 'border'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
