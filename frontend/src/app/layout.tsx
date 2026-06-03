'use client'

import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, FolderOpen, Shield, Droplets, FileText,
  Code2, CreditCard, Settings, ChevronLeft, ChevronRight,
  Command, Search, Bell, CircleUser
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    items: [
      { href: '/dashboard', label: 'Dashboard',    icon: LayoutDashboard },
      { href: '/investigations', label: 'Investigations', icon: FolderOpen },
      { href: '/evidence', label: 'Evidence',      icon: Shield },
    ]
  },
  {
    label: 'Tools',
    items: [
      { href: '/watermark', label: 'Watermarking', icon: Droplets },
      { href: '/reports',   label: 'Reports',      icon: FileText },
    ]
  },
  {
    label: 'Platform',
    items: [
      { href: '/developer', label: 'Developer',   icon: Code2 },
      { href: '/billing',   label: 'Billing',     icon: CreditCard },
      { href: '/settings',  label: 'Settings',    icon: Settings },
    ]
  }
]

function NavItem({ href, label, icon: Icon, collapsed, active }: {
  href: string; label: string; icon: React.ComponentType<any>; collapsed: boolean; active: boolean
}) {
  return (
    <Link href={href} className={`fs-nav-item ${active ? 'active' : ''}`} style={{ justifyContent: collapsed ? 'center' : undefined }}>
      <Icon size={16} style={{ flexShrink: 0 }} />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Landing page at '/' — full screen, no shell
  if (pathname === '/') {
    return (
      <html lang="en">
        <head>
          <title>FiduScan — Digital Forensic Intelligence Platform</title>
          <meta name="description" content="Enterprise-grade deepfake detection, watermarking, and evidence chain for forensic investigations." />
        </head>
        <body>{children}</body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <title>FiduScan Platform</title>
        <meta name="description" content="FiduScan forensic investigation platform." />
      </head>
      <body style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside style={{
          width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          flexShrink: 0,
          background: 'var(--fs-surface)',
          borderRight: '1px solid var(--fs-border)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
          overflow: 'hidden',
          zIndex: 50,
        }}>

          {/* Logo */}
          <div style={{
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '0' : '0 16px',
            borderBottom: '1px solid var(--fs-border)',
            flexShrink: 0,
          }}>
            {!collapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'var(--fs-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.625rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em'
                }}>FS</div>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.02em', color: 'var(--fs-text-1)' }}>
                  FiduScan
                </span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="fs-btn-ghost fs-btn"
              style={{ width: 28, height: 28, padding: 0, borderRadius: 6, flexShrink: 0 }}
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
            {NAV_SECTIONS.map((section, si) => (
              <div key={si}>
                {section.label && !collapsed && (
                  <div className="fs-nav-section-label">{section.label}</div>
                )}
                {section.items.map(item => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    collapsed={collapsed}
                    active={pathname.startsWith(item.href)}
                  />
                ))}
              </div>
            ))}
          </nav>

          {/* User */}
          {!collapsed && (
            <div style={{
              padding: '12px 8px',
              borderTop: '1px solid var(--fs-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--fs-elevated)',
                  border: '1px solid var(--fs-border-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CircleUser size={14} color="var(--fs-text-2)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--fs-text-1)' }}>Investigator</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Pro Plan</div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── Main area ───────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Topbar */}
          <header className="fs-topbar">
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                className="fs-btn fs-btn-secondary fs-btn-sm"
                style={{ gap: 8, color: 'var(--fs-text-2)', minWidth: 200, justifyContent: 'flex-start' }}
                aria-label="Search"
              >
                <Search size={13} />
                <span style={{ fontSize: '0.8125rem' }}>Search cases, evidence…</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>⌘K</span>
              </button>
            </div>
            <button className="fs-btn fs-btn-ghost fs-btn-sm" aria-label="Notifications">
              <Bell size={15} />
            </button>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
