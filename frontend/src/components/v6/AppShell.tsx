'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, FolderOpen, Shield, Droplets, FileText,
  Code2, CreditCard, Settings, ChevronLeft, ChevronRight,
  Search, Bell, CircleUser, Fingerprint
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
    label: 'Analysis',
    items: [
      { href: '/watermark', label: 'Watermarking', icon: Droplets },
      { href: '/reports',   label: 'Reports',      icon: FileText },
    ]
  },
  {
    label: 'System',
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
      style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
    >
      <Icon size={15} strokeWidth={1.5} style={{ flexShrink: 0 }} aria-hidden="true" />
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
      <a href="#main-content" style={{ position: 'absolute', left: '-9999px' }}>Skip to main content</a>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        role="navigation"
        aria-label="Primary navigation"
        style={{
          width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          flexShrink: 0,
          background: 'var(--fs-bg)',
          borderRight: '1px solid var(--fs-border)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width var(--t-fast)',
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
          background: 'var(--fs-surface)',
        }}>
          {!collapsed && (
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <div style={{
                width: 24, height: 24, borderRadius: 'var(--r-xs)',
                background: 'var(--fs-text-1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--fs-text-inverse)'
              }} aria-hidden="true">
                <Fingerprint size={14} strokeWidth={2} />
              </div>
              <span style={{ fontWeight: 500, fontSize: '0.875rem', letterSpacing: '-0.02em', color: 'var(--fs-text-1)' }}>
                FiduScan
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="fs-btn-ghost fs-btn"
            style={{ width: 24, height: 24, padding: 0, borderRadius: 'var(--r-xs)', flexShrink: 0, minWidth: 'auto' }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }} aria-label="App sections">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} role="group" aria-label={section.label ?? 'Core'}>
              {section.label && !collapsed && (
                <div className="fs-nav-section-label">{section.label}</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
            </div>
          ))}
        </nav>

        {/* User */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--fs-border)', background: 'var(--fs-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 'var(--r-xs)',
                background: 'var(--fs-bg)',
                border: '1px solid var(--fs-border-strong)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <CircleUser size={14} color="var(--fs-text-2)" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--fs-text-1)', lineHeight: 1.2 }}>Investigator</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>ID: FS-9021</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <header style={{
          height: 'var(--topbar-height)',
          borderBottom: '1px solid var(--fs-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 16,
          background: 'var(--fs-surface)',
          zIndex: 40,
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 300 }}>
              <Search size={14} color="var(--fs-text-3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search case files, evidence, hashes..." 
                className="fs-input" 
                style={{ paddingLeft: 32, height: 32, fontSize: '0.8125rem', background: 'var(--fs-bg)', border: '1px solid var(--fs-border)' }}
              />
              <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--fs-text-3)', border: '1px solid var(--fs-border)', padding: '2px 4px', borderRadius: 'var(--r-xs)' }}>
                ⌘K
              </div>
            </div>
          </div>
          <button className="fs-btn fs-btn-ghost fs-btn-sm" style={{ padding: '0 8px' }} aria-label="Notifications">
            <Bell size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </header>

        {/* Page content */}
        <main
          id="main-content"
          style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, background: 'var(--fs-bg)' }}
          role="main"
        >
          {children}
        </main>
      </div>
    </>
  )
}
