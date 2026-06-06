// Root layout — SERVER COMPONENT (no 'use client')
// Handles html/body, global metadata, and Google Fonts.
// The interactive AppShell is a separate client component.

import type { Metadata } from 'next'
import './globals.css'
import { AppShell } from '@/components/v6/AppShell'

export const metadata: Metadata = {
  title: {
    template: '%s | FiduScan',
    default: 'FiduScan — Digital Forensic Intelligence Platform',
  },
  description:
    'Enterprise forensic platform for deepfake detection, digital watermarking, and immutable evidence chains. Built for investigators who require legal-grade proof.',
  keywords: [
    'deepfake detection', 'digital forensics', 'evidence chain',
    'blockchain anchoring', 'digital watermarking', 'media authentication',
    'forensic investigation', 'AI deepfake',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'FiduScan',
    title: 'FiduScan — Digital Forensic Intelligence Platform',
    description:
      'Enterprise forensic platform for deepfake detection, digital watermarking, and immutable evidence chains.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FiduScan — Digital Forensic Intelligence Platform',
    description:
      'Enterprise deepfake detection, watermarking, and blockchain-anchored evidence chains.',
  },
  alternates: {
    canonical: 'https://fiduscan.io',
  },
  metadataBase: new URL('https://fiduscan.io'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts with preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#08090C" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
