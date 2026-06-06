import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Watermark Studio',
  description: 'Embed, extract, and verify forensic watermarks across image, audio, and video.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
