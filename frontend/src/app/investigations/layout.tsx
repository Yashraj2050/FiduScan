import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Investigations',
  description: 'Manage and investigate forensic cases with evidence, notes, and chain of custody.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
