import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Developer Portal',
  description: 'Manage API keys, webhooks, and monitor usage for programmatic access to FiduScan.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
