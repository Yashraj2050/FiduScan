import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Evidence Vault',
  description: 'Verify evidence integrity, view chain of custody, and inspect blockchain anchors.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
