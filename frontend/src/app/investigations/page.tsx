'use client'

import { useState } from 'react'
import { Plus, Filter, ChevronRight, FolderOpen, Shield, FileText, Link2, MessageSquare, Download, Clock } from 'lucide-react'

const CASES = [
  { id: 'INV-0047', title: 'Sports Media Forgery Ring', status: 'open', priority: 'critical', owner: 'Analyst A', evidence: 8, updated: '4m ago', desc: 'Investigation into AI-generated athlete footage submitted to international sports federation.' },
  { id: 'INV-0046', title: 'Political Deepfake — EU Parliament', status: 'in_review', priority: 'high', owner: 'Analyst B', evidence: 5, updated: '18m ago', desc: 'Viral video allegedly depicting MEP making unauthorized statements. Origin unclear.' },
  { id: 'INV-0045', title: 'Music Label IP Dispute', status: 'open', priority: 'medium', owner: 'Analyst A', evidence: 11, updated: '1h ago', desc: 'Watermark extraction to confirm original authorship of audio stems.' },
  { id: 'INV-0044', title: 'Insurance Fraud — Vehicle Damage', status: 'in_review', priority: 'high', owner: 'Analyst C', evidence: 6, updated: '2h ago', desc: 'Photos submitted by claimant show signs of digital compositing.' },
  { id: 'INV-0043', title: 'Social Media Disinformation', status: 'closed', priority: 'low', owner: 'Analyst B', evidence: 14, updated: '1d ago', desc: 'Coordinated campaign using face-swapped videos. Report exported for law enforcement.' },
]

const STATUS_BADGE: Record<string, string> = {
  open: 'fs-badge-accent', in_review: 'fs-badge-uncertain', closed: 'fs-badge-neutral',
}
const STATUS_LABEL: Record<string, string> = {
  open: 'Open', in_review: 'In Review', closed: 'Closed',
}
const PRIORITY_COLOR: Record<string, string> = {
  critical: '#EF4444', high: '#F97316', medium: '#EAB308', low: '#6B7280',
}

const CUSTODY_EVENTS = [
  { action: 'Blockchain anchor confirmed', actor: 'System', time: '4m ago' },
  { action: 'Evidence ev_8821 added', actor: 'Analyst A', time: '12m ago' },
  { action: 'Review submitted', actor: 'Analyst B', time: '1h ago' },
  { action: 'Case created', actor: 'Analyst A', time: '3h ago' },
]

export default function InvestigationsPage() {
  const [selected, setSelected] = useState(CASES[0])
  const [tab, setTab] = useState<'evidence'|'notes'|'custody'|'export'>('evidence')

  return (
    <div style={{ height: '100%', display: 'flex' }}>

      {/* ── Case List ─────────────────────────────────────────── */}
      <aside style={{
        width: 320, flexShrink: 0,
        borderRight: '1px solid var(--fs-border)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--fs-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.02em' }}>Investigations</h2>
            <button className="fs-btn fs-btn-primary fs-btn-sm">
              <Plus size={13} /> New
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="fs-input" style={{ fontSize: '0.8125rem', height: 32 }} placeholder="Search cases…" />
            <button className="fs-btn fs-btn-secondary fs-btn-sm"><Filter size={13} /></button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {CASES.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--fs-border)',
                cursor: 'pointer',
                background: selected.id === c.id ? 'var(--fs-accent-dim)' : 'transparent',
                borderLeft: selected.id === c.id ? '2px solid var(--fs-accent)' : '2px solid transparent',
                transition: 'all 0.12s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="fs-mono" style={{ color: 'var(--fs-accent-light)' }}>{c.id}</span>
                <span className={`fs-badge ${STATUS_BADGE[c.status]}`}>{STATUS_LABEL[c.status]}</span>
              </div>
              <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: 6, color: 'var(--fs-text-1)' }}>{c.title}</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: PRIORITY_COLOR[c.priority] }} />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', textTransform: 'capitalize' }}>{c.priority}</span>
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>{c.evidence} items</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginLeft: 'auto' }}>{c.updated}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Case Detail ───────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {/* Case Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--fs-border)',
          background: 'var(--fs-surface)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>{selected.id}</span>
                <span className={`fs-badge ${STATUS_BADGE[selected.status]}`}>{STATUS_LABEL[selected.status]}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[selected.priority] }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--fs-text-2)', textTransform: 'capitalize' }}>{selected.priority} priority</span>
                </div>
              </div>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6 }}>{selected.title}</h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--fs-text-2)', maxWidth: 600 }}>{selected.desc}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="fs-btn fs-btn-secondary fs-btn-sm"><Download size={13} /> Export</button>
              <button className="fs-btn fs-btn-primary fs-btn-sm"><Shield size={13} /> Add Evidence</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="fs-tabs" style={{ maxWidth: 460, marginTop: 16 }}>
            {(['evidence','notes','custody','export'] as const).map(t => (
              <button key={t} className={`fs-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px 28px' }}>

          {tab === 'evidence' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {Array.from({ length: selected.evidence }, (_, i) => (
                <div key={i} className="fs-card" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span className="fs-badge fs-badge-chain"><Link2 size={10} /> Anchored</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>{i + 1}h ago</span>
                  </div>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: 4 }}>
                    {['Image', 'Video', 'Audio'][i % 3]} evidence item #{i + 1}
                  </div>
                  <div className="fs-hash" style={{ marginBottom: 10 }}>
                    sha256:a{Math.random().toString(16).slice(2, 38)}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className={`fs-badge ${i % 3 === 1 ? 'fs-badge-tampered' : 'fs-badge-verified'}`}>
                      {i % 3 === 1 ? '⚠ Tampered' : '✓ Authentic'}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Score: {(0.85 + (i * 0.01) % 0.15).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'notes' && (
            <div style={{ maxWidth: 680 }}>
              <div className="fs-card" style={{ padding: '20px', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--fs-elevated)', border: '1px solid var(--fs-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--fs-accent-light)' }}>A</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Analyst A</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)' }}>3h ago</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--fs-text-1)', lineHeight: 1.6 }}>
                  Initial scan complete. Frame sequence {`0-412`} shows significant temporal inconsistency in the facial region. 
                  Confidence: 97.3%. Recommending full report generation and blockchain anchoring before submission.
                </p>
              </div>
              <textarea className="fs-input" style={{ height: 100, padding: '12px', resize: 'vertical' }} placeholder="Add investigator note…" />
              <button className="fs-btn fs-btn-primary fs-btn-sm" style={{ marginTop: 10 }}><MessageSquare size={13} /> Add Note</button>
            </div>
          )}

          {tab === 'custody' && (
            <div style={{ maxWidth: 600 }}>
              <div className="fs-chain-timeline">
                {CUSTODY_EVENTS.map((e, i) => (
                  <div key={i} className="fs-chain-event">
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{e.action}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--fs-text-2)' }}>{e.actor}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)' }}>{e.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'export' && (
            <div style={{ maxWidth: 560 }}>
              <div className="fs-card" style={{ padding: '28px' }}>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Export Evidence Package</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--fs-text-2)', lineHeight: 1.6, marginBottom: 24 }}>
                  Download a complete ZIP bundle containing all evidence items, authenticity reports, chain-of-custody logs, and blockchain anchor hashes for this case.
                </p>
                <button className="fs-btn fs-btn-primary"><Download size={14} /> Download ZIP Package</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
