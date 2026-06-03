import './globals.css'
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-zinc-900 text-white">
        <aside className="w-64 bg-black p-4 flex flex-col gap-4 border-r border-zinc-800">
          <div className="font-bold text-xl mb-4 text-blue-500">FiduScan v3.0</div>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="hover:text-blue-400">Dashboard</Link>
            <Link href="/investigations" className="hover:text-blue-400">Investigations</Link>
            <Link href="/evidence" className="hover:text-blue-400">Evidence</Link>
            <Link href="/watermark" className="hover:text-blue-400">Watermarking</Link>
            <Link href="/reports" className="hover:text-blue-400">Reports</Link>
            <Link href="/developer" className="hover:text-blue-400">Developer Portal</Link>
            <Link href="/billing" className="hover:text-blue-400">Billing</Link>
            <Link href="/settings" className="hover:text-blue-400">Settings</Link>
          </nav>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
