import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ToastContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'FiduScan — AI Media Forensics',
  description:
    'Detect AI-generated images, audio, and video with confidence scoring, EXIF metadata analysis, and explainability heatmaps. Protect your platform from synthetic media.',
  keywords: ['AI detection', 'deepfake detection', 'media forensics', 'image authentication', 'synthetic media', 'FiduScan'],
  authors: [{ name: 'FiduScan' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
