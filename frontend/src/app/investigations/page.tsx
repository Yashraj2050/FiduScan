'use client'
import { useState } from 'react'
import { Plus, Filter, ChevronRight, FolderOpen, Shield, FileText, Link2, MessageSquare, Download, Clock, Network, Activity } from 'lucide-react'

const CASES = [
  { id: 'INV-0047', title: 'Sports Media Forgery Ring', status: 'open', priority: 'critical', owner: 'ANALYST_A', evidence: 8, updated: '4m ago', desc: 'Investigation into AI-generated athlete footage submitted to international sports federation.' },
  { id: 'INV-0046', title: 'Political Deepfake — EU Parliament', status: 'in_review', priority: 'high', owner: 'ANALYST_B', evidence: 5, updated: '18m ago', desc: 'Viral video allegedly depicting MEP making unauthorized statements. Origin unclear.' },
  { id: 'INV-0045', title: 'Music Label IP Dispute', status: 'open', priority: 'medium', owner: 'ANALYST_A', evidence: 11, updated: '1h ago', desc: 'Watermark extraction to confirm original authorship of audio stems.' },
  { id: 'INV-0044', title: 'Insurance Fraud — Vehicle Damage', status: 'in_review', priority: 'high', owner: 'ANALYST_C', evidence: 6, updated: '2h ago', desc: 'Photos submitted by claimant show signs of digital compositing.' },
  { id: 'INV-0043', title: 'Social Media Disinformation', status: 'closed', priority: 'low', owner: 'ANALYST_B', evidence: 14, updated: '1d ago', desc: 'Coordinated campaign using face-swapped videos. Report exported for law enforcement.' },
]

const STATUS_BADGE: Record<string, string> = {
  open: 'fs-badge-accent', in_review: 'fs-badge-uncertain', closed: 'fs-badge-neutral',
}
const STATUS_LABEL: Record<string, string> = {
  open: 'OPEN', in_review: 'REVIEW', closed: 'CLOSED',
}
const PRIORITY_COLOR: Record<string, string> = {
  critical: 'var(--fs-tampered)', high: 'var(--fs-uncertain)', medium: 'var(--fs-info)', low: 'var(--fs-text-3)',
}

const CUSTODY_EVENTS = [
  { action: 'BLOCKCHAIN_ANCHOR_CONFIRMED', actor: 'SYSTEM_AUTO', time: '4m ago' },
  { action: 'EVIDENCE_RECORD_ADDED (EV-8821)', actor: 'ANALYST_A', time: '12m ago' },
  { action: 'REVIEW_SUBMITTED', actor: 'ANALYST_B', time: '1h ago' },
  { action: 'CASE_INITIALIZED', actor: 'ANALYST_A', time: '3h ago' },
]

export default function InvestigationsPage() {
  const [selected, setSelected] = useState(CASES[0])
  const [tab, setTab] = useState<'evidence'|'notes'|'custody'|'export'>('evidence')

  return (
    <div style={{ height: '100%', display: 'flex' }}>

      {/* ── Case List ─────────────────────────────────────────── */}
      <aside style={{
        width: 380, flexShrink: 0,
        borderRight: '1px solid var(--fs-border)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--fs-surface)',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--fs-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="fs-h3">Investigations</h2>
            <button className="fs-btn fs-btn-primary fs-btn-sm" style={{ padding: '0 12px' }}>
              <Plus size={14} /> NEW
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="fs-input fs-mono" style={{ fontSize: '0.75rem', height: 32 }} placeholder="SEARCH_CASES..." />
            <button className="fs-btn fs-btn-secondary fs-btn-sm" style={{ padding: '0 8px' }}><Filter size={14} /></button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {CASES.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--fs-border)',
                cursor: 'pointer',
                background: selected.id === c.id ? 'var(--fs-panel)' : 'transparent',
                borderLeft: selected.id === c.id ? '2px solid var(--fs-text-1)' : '2px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="fs-mono" style={{ color: selected.id === c.id ? 'var(--fs-text-1)' : 'var(--fs-text-3)' }}>{c.id}</span>
                <span className={`fs-mono`} style={{ fontSize: '0.6875rem', color: PRIORITY_COLOR[c.priority] }}>
                  {c.priority.toUpperCase()}
                </span>
              </div>
              <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: 8, color: 'var(--fs-text-1)' }}>{c.title}</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span className="fs-badge fs-badge-neutral" style={{ padding: '2px 4px' }}>{STATUS_LABEL[c.status]}</span>
                <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>EVIDENCE: {c.evidence}</span>
                <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginLeft: 'auto' }}>{c.updated}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Case Detail ───────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--fs-bg)' }}>
        {/* Case Header */}
        <div style={{
          padding: '40px 40px 0',
          borderBottom: '1px solid var(--fs-border)',
          background: 'var(--fs-bg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>CASE: {selected.id}</span>
                <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>/</span>
                <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>OWNER: {selected.owner}</span>
                <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, background: PRIORITY_COLOR[selected.priority] }} />
                  <span className="fs-mono" style={{ fontSize: '0.75rem', color: PRIORITY_COLOR[selected.priority] }}>{selected.priority.toUpperCase()} PRIORITY</span>
                </div>
              </div>
              <h1 className="fs-h1" style={{ marginBottom: 12 }}>{selected.title}</h1>
              <p style={{ fontSize: '1rem', color: 'var(--fs-text-2)', maxWidth: 720, lineHeight: 1.6 }}>{selected.desc}</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="fs-btn fs-btn-secondary"><Download size={14} /> EXPORT_ALL</button>
              <button className="fs-btn fs-btn-primary"><Shield size={14} /> INGEST_EVIDENCE</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="fs-tabs" style={{ maxWidth: '100%', marginTop: 32 }}>
            {(['evidence','notes','custody','export'] as const).map(t => (
              <button key={t} className={`fs-tab fs-mono ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'uppercase', padding: '16px 24px' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '40px' }}>

          {tab === 'evidence' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
              {Array.from({ length: selected.evidence }, (_, i) => (
                <div key={i} style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-chain)', background: 'var(--fs-chain-dim)', padding: '2px 4px', border: '1px solid var(--fs-chain-dim)' }}>ON-CHAIN</span>
                    <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>T-{i + 1}h</span>
                  </div>
                  <div style={{ fontWeight: 500, fontSize: '0.9375rem', marginBottom: 8, color: 'var(--fs-text-1)' }}>
                    {['IMG', 'VID', 'AUD'][i % 3]}_EVIDENCE_{String(i + 1).padStart(3, '0')}
                  </div>
                  <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-2)', marginBottom: 16, background: 'var(--fs-bg)', padding: '4px 8px', border: '1px solid var(--fs-border)' }}>
                    SHA: a{(i * 987654321).toString(16).padEnd(36, '0')}
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', borderTop: '1px solid var(--fs-border)', paddingTop: 16 }}>
                    <span className={`fs-mono`} style={{ fontSize: '0.6875rem', color: i % 3 === 1 ? 'var(--fs-tampered)' : 'var(--fs-verified)' }}>
                      {i % 3 === 1 ? 'TAMPERED' : 'VERIFIED'}
                    </span>
                    <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginLeft: 'auto' }}>
                      AUTH_SCORE: {((0.85 + (i * 0.01) % 0.15) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'notes' && (
            <div style={{ maxWidth: 800 }}>
              <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '32px', marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, background: 'var(--fs-text-1)', color: 'var(--fs-text-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 600 }}>A</div>
                  <div>
                    <div className="fs-mono" style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--fs-text-1)' }}>ANALYST_A</div>
                    <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>T-3h</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--fs-text-2)', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>
                  &gt; Initial scan complete.<br/>
                  &gt; Frame sequence 0-412 shows significant temporal inconsistency in the facial region.<br/>
                  &gt; Confidence: 97.3%.<br/>
                  &gt; Recommending full report generation and blockchain anchoring before submission.
                </p>
              </div>
              <textarea className="fs-input fs-mono" style={{ height: 120, padding: '16px', resize: 'vertical', fontSize: '0.875rem' }} placeholder="APPEND_NOTE..." />
              <button className="fs-btn fs-btn-primary" style={{ marginTop: 16 }}><MessageSquare size={14} /> APPEND</button>
            </div>
          )}

          {tab === 'custody' && (
            <div style={{ maxWidth: 720 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--fs-border-strong)' }}>
                {CUSTODY_EVENTS.map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24, background: 'var(--fs-panel)', padding: '20px' }}>
                    <span className="fs-mono" style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', width: 120 }}>{e.time}</span>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="fs-mono" style={{ fontSize: '0.875rem', color: 'var(--fs-text-1)' }}>{e.action}</span>
                      <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>AUTHORITY: {e.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'export' && (
            <div style={{ maxWidth: 640 }}>
              <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '40px' }}>
                <div className="fs-label" style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Download size={14} color="var(--fs-text-2)" />
                  EVIDENCE PACKAGE GENERATION
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--fs-text-2)', lineHeight: 1.6, marginBottom: 32 }}>
                  Generate a complete forensic package containing all evidence items, authenticity reports, chain-of-custody logs, and blockchain anchor verification hashes for Case {selected.id}.
                </p>
                <button className="fs-btn fs-btn-primary fs-btn-lg" style={{ width: '100%' }}>
                  GENERATE_AND_DOWNLOAD_BUNDLE
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
