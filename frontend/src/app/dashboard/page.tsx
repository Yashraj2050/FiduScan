'use client'

import Link from 'next/link'
import {
  FolderOpen, Shield, Link2, Droplets, FileText,
  TrendingUp, ChevronRight, Clock, CheckCircle2, AlertTriangle, Circle
} from 'lucide-react'

const STATS = [
  { label: 'Active Cases',    value: '7',    delta: '+2 this week',  color: 'var(--fs-accent)',   icon: FolderOpen },
  { label: 'Evidence Items',  value: '43',   delta: '+12 this week', color: 'var(--fs-verified)', icon: Shield },
  { label: 'Anchored Hashes', value: '38',   delta: '88% of items',  color: 'var(--fs-chain)',    icon: Link2 },
  { label: 'Reports Generated', value: '21', delta: '+5 this week',  color: 'var(--fs-uncertain)',icon: FileText },
]

const ACTIVITY = [
  { id: 'ev_8821', type: 'Evidence Anchored', case: 'Case #0047 — Sports Media', status: 'verified', time: '4m ago' },
  { id: 'ev_8820', type: 'Deepfake Detected',  case: 'Case #0046 — Governance',  status: 'tampered', time: '18m ago' },
  { id: 'ev_8818', type: 'Watermark Verified', case: 'Case #0045 — IP Dispute',  status: 'verified', time: '1h ago' },
  { id: 'ev_8817', type: 'Case Submitted for Review', case: 'Case #0044 — Insurance', status: 'uncertain', time: '2h ago' },
  { id: 'ev_8815', type: 'Report Exported',   case: 'Case #0043 — Social Media', status: 'verified', time: '5h ago' },
]

const RECENT_CASES = [
  { id: 'INV-0047', title: 'Sports Media Forgery', status: 'open',        priority: 'critical', evidence: 8, updated: '4m ago' },
  { id: 'INV-0046', title: 'Political Deepfake',   status: 'in_review',   priority: 'high',     evidence: 5, updated: '18m ago' },
  { id: 'INV-0045', title: 'Music Label IP Dispute', status: 'open',      priority: 'medium',   evidence: 11, updated: '1h ago' },
  { id: 'INV-0044', title: 'Insurance Fraud Case', status: 'in_review',   priority: 'high',     evidence: 6, updated: '2h ago' },
]

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  open:      { label: 'Open',      cls: 'fs-badge-accent' },
  in_review: { label: 'In Review', cls: 'fs-badge-uncertain' },
  closed:    { label: 'Closed',    cls: 'fs-badge-neutral' },
}

const PRIORITY_DOT: Record<string, string> = {
  critical: '#EF4444',
  high:     '#F97316',
  medium:   '#EAB308',
  low:      '#6B7280',
}

export default function DashboardPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--fs-text-1)' }}>
          Command Center
        </h1>
        <p style={{ color: 'var(--fs-text-2)', marginTop: 4, fontSize: '0.875rem' }}>
          Overview of active investigations, evidence status, and platform health.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="fs-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="fs-label">{s.label}</span>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: `${s.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={14} color={s.color} />
                </div>
              </div>
              <div className="fs-stat-value" style={{ color: 'var(--fs-text-1)' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', marginTop: 4 }}>{s.delta}</div>
            </div>
          )
        })}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>

        {/* Recent Cases */}
        <div className="fs-card">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--fs-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Active Investigations</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', marginTop: 2 }}>Sorted by most recently updated</p>
            </div>
            <Link href="/investigations" className="fs-btn fs-btn-ghost fs-btn-sm">
              View All <ChevronRight size={13} />
            </Link>
          </div>

          <table className="fs-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Evidence</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_CASES.map(c => {
                const sb = STATUS_BADGE[c.status]
                return (
                  <tr key={c.id} style={{ cursor: 'pointer' }}>
                    <td>
                      <span className="fs-mono" style={{ color: 'var(--fs-accent-light)' }}>{c.id}</span>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: '0.875rem' }}>{c.title}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_DOT[c.priority] }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--fs-text-2)', textTransform: 'capitalize' }}>{c.priority}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--fs-text-2)', fontSize: '0.875rem' }}>{c.evidence}</td>
                    <td>
                      <span className={`fs-badge ${sb.cls}`}>{sb.label}</span>
                    </td>
                    <td style={{ color: 'var(--fs-text-3)', fontSize: '0.75rem' }}>{c.updated}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}
        <div className="fs-card">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--fs-border)' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Activity Feed</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', marginTop: 2 }}>Live platform events</p>
          </div>

          <div style={{ padding: '12px 0' }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} className="fs-data-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`fs-status-dot ${a.status}`} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{a.type}</span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>{a.time}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--fs-text-2)', paddingLeft: 14 }}>{a.case}</div>
                <div style={{ fontSize: '0.6875rem', paddingLeft: 14 }}>
                  <span className="fs-hash">{a.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { href: '/investigations', icon: FolderOpen, label: 'New Investigation', desc: 'Open a new case and begin collecting evidence', color: 'var(--fs-accent)' },
          { href: '/watermark',      icon: Droplets,   label: 'Embed Watermark',   desc: 'Protect your media assets with a forensic watermark', color: 'var(--fs-verified)' },
          { href: '/evidence',       icon: Shield,     label: 'Verify Evidence',   desc: 'Check integrity of an existing evidence record', color: 'var(--fs-chain)' },
        ].map((a, i) => {
          const Icon = a.icon
          return (
            <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
              <div className="fs-card fs-card-interactive" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${a.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon size={18} color={a.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: 4, color: 'var(--fs-text-1)' }}>{a.label}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--fs-text-2)', lineHeight: 1.5 }}>{a.desc}</div>
                </div>
                <ChevronRight size={16} color="var(--fs-text-3)" style={{ marginLeft: 'auto', flexShrink: 0, marginTop: 2 }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
