'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, FolderOpen, Shield, Droplets, FileText,
  Code2, CreditCard, Settings, ChevronLeft, ChevronRight,
  Search, Bell, CircleUser
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    items: [
      { href: '/dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
      { href: '/investigations', label: 'Investigations', icon: FolderOpen },
      { href: '/evidence',       label: 'Evidence',       icon: Shield },
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
      { href: '/developer', label: 'Developer', icon: Code2 },
      { href: '/billing',   label: 'Billing',   icon: CreditCard },
      { href: '/settings',  label: 'Settings',  icon: Settings },
    ]
  }
]

function NavItem({ href, label, icon: Icon, collapsed, active }: {
  href: string; label: string; icon: React.ComponentType<any>; collapsed: boolean; active: boolean
}) {
  return (
    <Link
      href={href}
      className={`fs-nav-item ${active ? 'active' : ''}`}
      style={{ justifyContent: collapsed ? 'center' : undefined }}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
    >
      <Icon size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Landing page — full-screen passthrough, no chrome
  if (pathname === '/') {
    return <>{children}</>
  }

  return (
    <>
      {/* Skip-to-content for keyboard/screen-reader users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        role="navigation"
        aria-label="Primary navigation"
        style={{
          width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          flexShrink: 0,
          background: 'var(--fs-surface)',
          borderRight: '1px solid var(--fs-border)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
          overflow: 'hidden',
          zIndex: 50,
        }}
      >
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
              }} aria-hidden="true">FS</div>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.02em', color: 'var(--fs-text-1)' }}>
                FiduScan
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="fs-btn-ghost fs-btn"
            style={{ width: 28, height: 28, padding: 0, borderRadius: 6, flexShrink: 0 }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }} aria-label="App sections">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} role="group" aria-label={section.label ?? 'Core'}>
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
          <div style={{ padding: '12px 8px', borderTop: '1px solid var(--fs-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--fs-elevated)',
                border: '1px solid var(--fs-border-strong)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <CircleUser size={14} color="var(--fs-text-2)" aria-hidden="true" />
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
              className="fs-btn fs-btn-secondary fs-btn-sm fs-topbar-search"
              style={{ gap: 8, color: 'var(--fs-text-2)', minWidth: 200, justifyContent: 'flex-start' }}
              aria-label="Search cases and evidence (⌘K)"
              aria-keyshortcuts="Meta+k"
            >
              <Search size={13} aria-hidden="true" />
              <span style={{ fontSize: '0.8125rem' }}>Search cases, evidence…</span>
              <span className="fs-kbd" style={{ marginLeft: 'auto' }} aria-hidden="true">⌘K</span>
            </button>
          </div>
          <button className="fs-btn fs-btn-ghost fs-btn-sm" aria-label="Notifications">
            <Bell size={15} aria-hidden="true" />
          </button>
        </header>

        {/* Page content */}
        <main
          id="main-content"
          style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}
          role="main"
        >
          {children}
        </main>
      </div>
    </>
  )
}
