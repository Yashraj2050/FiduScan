import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FiduScan — AI Forensic Detection System',
  description:
    'Anti-Gravity Phase 1: Detect AI-generated vs authentic images with confidence scoring, EXIF metadata analysis, and explainability heatmaps.',
  keywords: ['AI detection', 'deepfake', 'forensic analysis', 'image authentication', 'FiduScan'],
  authors: [{ name: 'Anti-Gravity Forensic System' }],
  robots: 'noindex, nofollow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
