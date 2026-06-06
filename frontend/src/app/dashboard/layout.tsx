import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Command center — active investigations, evidence status, and platform activity.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
