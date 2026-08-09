'use client'
import Link from 'next/link'
import {
  FolderOpen, Shield, Link2, Droplets, FileText,
  ChevronRight, Clock, AlertTriangle, Fingerprint, Activity,
  Server, HardDrive
} from 'lucide-react'

const STATS = [
  { label: 'ACTIVE INVESTIGATIONS', value: '7',    meta: 'SYS_NOMINAL', color: 'var(--fs-text-1)',   icon: FolderOpen },
  { label: 'EVIDENCE ITEMS',        value: '43',   meta: 'VERIFIED_40', color: 'var(--fs-verified)', icon: Shield },
  { label: 'BLOCKCHAIN ANCHORS',    value: '38',   meta: 'POLYGON_MAIN',color: 'var(--fs-chain)',    icon: Link2 },
  { label: 'FORENSIC REPORTS',      value: '21',   meta: 'SECURE_STORE',color: 'var(--fs-text-2)',   icon: FileText },
]

const ACTIVITY = [
  { id: 'EV-8821', type: 'BLOCKCHAIN_ANCHOR_SUCCESS', case: 'INV-0047', status: 'verified', time: '14:32:01' },
  { id: 'EV-8820', type: 'DEEPFAKE_TAMPER_DETECTED',  case: 'INV-0046', status: 'tampered', time: '14:18:44' },
  { id: 'EV-8818', type: 'WATERMARK_VERIFIED',        case: 'INV-0045', status: 'verified', time: '13:02:11' },
  { id: 'EV-8817', type: 'ANALYSIS_PENDING_REVIEW',   case: 'INV-0044', status: 'uncertain',time: '12:04:59' },
  { id: 'EV-8815', type: 'REPORT_EXPORTED_PDF',       case: 'INV-0043', status: 'verified', time: '09:41:22' },
]

const RECENT_CASES = [
  { id: 'INV-0047', title: 'Sports Media Forgery', status: 'open',        priority: 'critical', evidence: 8, updated: '4m ago' },
  { id: 'INV-0046', title: 'Political Deepfake',   status: 'in_review',   priority: 'high',     evidence: 5, updated: '18m ago' },
  { id: 'INV-0045', title: 'Music Label IP Dispute', status: 'open',      priority: 'medium',   evidence: 11, updated: '1h ago' },
  { id: 'INV-0044', title: 'Insurance Fraud Case', status: 'in_review',   priority: 'high',     evidence: 6, updated: '2h ago' },
]

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  open:      { label: 'OPEN',      cls: 'fs-badge-accent' },
  in_review: { label: 'REVIEW',    cls: 'fs-badge-uncertain' },
  closed:    { label: 'CLOSED',    cls: 'fs-badge-neutral' },
}

const PRIORITY_DOT: Record<string, string> = {
  critical: 'var(--fs-tampered)',
  high:     'var(--fs-uncertain)',
  medium:   'var(--fs-info)',
  low:      'var(--fs-text-3)',
}

export default function DashboardPage() {
  return (
    <div style={{ padding: '40px', maxWidth: 1440, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="fs-label" style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <Activity size={12} color="var(--fs-verified)" />
            SYSTEM INTELLIGENCE OVERVIEW
          </div>
          <h1 className="fs-h1">Command Center</h1>
        </div>
        <div className="fs-mono" style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', textAlign: 'right' }}>
          <div>LAST_UPDATE: {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC</div>
          <div>SERVER: SECURE_CLUSTER_A1</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--fs-border-strong)', marginBottom: 32, border: '1px solid var(--fs-border-strong)' }}>
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} style={{ background: 'var(--fs-panel)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span className="fs-label">{s.label}</span>
                <Icon size={14} color={s.color} />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 400, lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--fs-text-1)' }}>{s.value}</span>
              </div>
              <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginTop: 12 }}>
                [{s.meta}]
              </div>
            </div>
          )
        })}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32 }}>

        {/* Recent Cases */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--fs-border)', paddingBottom: 12 }}>
            <h3 className="fs-h3">Active Investigations</h3>
            <Link href="/investigations" className="fs-btn fs-btn-ghost fs-btn-sm" style={{ padding: 0 }}>
              VIEW ALL <ChevronRight size={14} style={{ marginLeft: 4 }} />
            </Link>
          </div>

          <table className="fs-table" role="table" aria-label="Active investigations">
            <thead>
              <tr role="row">
                <th role="columnheader">ID</th>
                <th role="columnheader">TITLE</th>
                <th role="columnheader">PRIORITY</th>
                <th role="columnheader">EVIDENCE</th>
                <th role="columnheader">STATUS</th>
                <th role="columnheader" style={{ textAlign: 'right' }}>UPDATED</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_CASES.map(c => {
                const sb = STATUS_BADGE[c.status]
                return (
                  <tr key={c.id} style={{ cursor: 'pointer' }}>
                    <td className="fs-mono" style={{ color: 'var(--fs-text-2)' }}>{c.id}</td>
                    <td style={{ fontWeight: 500 }}>{c.title}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 6, height: 6, background: PRIORITY_DOT[c.priority] }} />
                        <span className="fs-mono" style={{ fontSize: '0.6875rem', textTransform: 'uppercase' }}>{c.priority}</span>
                      </div>
                    </td>
                    <td className="fs-mono" style={{ color: 'var(--fs-text-2)' }}>{c.evidence}</td>
                    <td>
                      <span className={`fs-badge ${sb.cls}`}>{sb.label}</span>
                    </td>
                    <td className="fs-mono" style={{ color: 'var(--fs-text-3)', textAlign: 'right' }}>{c.updated}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--fs-border)', paddingBottom: 12 }}>
            <h3 className="fs-h3">System Log</h3>
            <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>LIVE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--fs-border)' }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ background: 'var(--fs-panel)', padding: '12px 16px', display: 'flex', gap: 12 }}>
                <span className={`fs-status-dot ${a.status}`} style={{ marginTop: 6 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span className="fs-mono" style={{ fontSize: '0.6875rem', color: a.status === 'tampered' ? 'var(--fs-tampered)' : 'var(--fs-text-1)' }}>
                      {a.type}
                    </span>
                    <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>{a.time}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-2)', background: 'var(--fs-surface)', padding: '2px 4px', border: '1px solid var(--fs-border)' }}>{a.id}</span>
                    <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>{a.case}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
