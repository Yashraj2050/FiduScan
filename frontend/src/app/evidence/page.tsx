'use client'

import { useState } from 'react'
import { Shield, Link2, Filter, Copy, ExternalLink, CheckCircle2, XCircle, AlertTriangle, ChevronDown } from 'lucide-react'

const EVIDENCE = [
  { id: 'EV-8821', type: 'Image', file: 'press_conference_photo.jpg', hash: 'a7f3c9d2e1b045983c78e2f1d9a04b2c3e15f8d7a09c1b3e2f4d67890abcdef1', score: 0.97, status: 'verified', anchored: true, watermark: 'verified', case: 'INV-0047' },
  { id: 'EV-8820', type: 'Video', file: 'speech_clip.mp4',            hash: 'f1e2d3c4b5a69780917263540817263abcdef1234567890abcdef1234567890ab', score: 0.12, status: 'tampered', anchored: true, watermark: 'missing', case: 'INV-0046' },
  { id: 'EV-8818', type: 'Audio', file: 'studio_stems_v3.wav',        hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12', score: 0.99, status: 'verified', anchored: true, watermark: 'verified', case: 'INV-0045' },
  { id: 'EV-8815', type: 'Image', file: 'vehicle_damage_01.png',      hash: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab', score: 0.23, status: 'tampered', anchored: false, watermark: 'missing', case: 'INV-0044' },
  { id: 'EV-8812', type: 'Video', file: 'social_spread.mp4',          hash: 'deadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678ab', score: 0.88, status: 'verified', anchored: true, watermark: 'embedded', case: 'INV-0043' },
]

function IntegrityMeter({ score }: { score: number }) {
  const r = 28
  const circumference = 2 * Math.PI * r
  const filled = circumference * score
  const color = score > 0.7 ? 'var(--fs-verified)' : score > 0.4 ? 'var(--fs-uncertain)' : 'var(--fs-tampered)'

  return (
    <div className="fs-integrity-ring" style={{ width: 72, height: 72 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span className="score-label" style={{ color, fontSize: '0.75rem', fontWeight: 700 }}>{Math.round(score * 100)}</span>
    </div>
  )
}

export default function EvidencePage() {
  const [selected, setSelected] = useState(EVIDENCE[0])

  return (
    <div style={{ height: '100%', display: 'flex' }}>

      {/* Evidence List */}
      <aside style={{ width: 380, flexShrink: 0, borderRight: '1px solid var(--fs-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--fs-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.02em' }}>Evidence Vault</h2>
            <button className="fs-btn fs-btn-ghost fs-btn-sm"><Filter size={13} /> Filter</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All','Image','Video','Audio'].map(f => (
              <button key={f} className="fs-btn fs-btn-ghost fs-btn-sm" style={{ fontSize: '0.75rem', padding: '0 10px' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {EVIDENCE.map(e => (
            <div
              key={e.id}
              onClick={() => setSelected(e)}
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--fs-border)',
                cursor: 'pointer',
                background: selected.id === e.id ? 'var(--fs-accent-dim)' : 'transparent',
                borderLeft: selected.id === e.id ? '2px solid var(--fs-accent)' : '2px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>{e.id}</span>
                <span className={`fs-badge ${e.status === 'verified' ? 'fs-badge-verified' : 'fs-badge-tampered'}`}>
                  {e.status === 'verified' ? '✓ Authentic' : '⚠ Tampered'}
                </span>
              </div>
              <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: 4 }}>{e.file}</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="fs-badge fs-badge-neutral">{e.type}</span>
                {e.anchored && <span className="fs-badge fs-badge-chain"><Link2 size={9} /> On-chain</span>}
                <span style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginLeft: 'auto' }}>{e.case}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Evidence Detail */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 28, alignItems: 'flex-start' }}>
          <IntegrityMeter score={selected.score} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>{selected.id}</span>
              <span className="fs-badge fs-badge-neutral">{selected.type}</span>
              <span className={`fs-badge ${selected.status === 'verified' ? 'fs-badge-verified' : 'fs-badge-tampered'}`}>
                {selected.status === 'verified' ? '✓ Authentic' : '⚠ Integrity Failure'}
              </span>
              {selected.anchored && <span className="fs-badge fs-badge-chain"><Link2 size={9} /> Anchored</span>}
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>{selected.file}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--fs-text-2)' }}>Case {selected.case} · Authenticity Score: {Math.round(selected.score * 100)}%</p>
          </div>
        </div>

        {/* Hash Section */}
        <div className="fs-card" style={{ padding: '20px', marginBottom: 20 }}>
          <div className="fs-label" style={{ marginBottom: 12 }}>Integrity Hashes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['SHA-256 (File)', 'SHA-256 (Report)', 'Anchor Hash'].map((label, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', width: 140, flexShrink: 0 }}>{label}</span>
                <span className="fs-hash" style={{ flex: 1 }}>{selected.hash.slice(0, i * 8)}...{selected.hash.slice(-12)}</span>
                <button className="fs-btn fs-btn-ghost fs-btn-sm" style={{ marginLeft: 8 }}><Copy size={12} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Chain Timeline */}
        <div className="fs-card" style={{ padding: '20px', marginBottom: 20 }}>
          <div className="fs-label" style={{ marginBottom: 16 }}>Chain of Custody</div>
          <div className="fs-chain-timeline">
            {[
              { action: 'Blockchain anchor confirmed on Polygon Mainnet', time: '4m ago', color: 'var(--fs-chain)' },
              { action: 'Authenticity report generated and stored', time: '12m ago', color: 'var(--fs-accent)' },
              { action: 'Watermark verification passed', time: '18m ago', color: 'var(--fs-verified)' },
              { action: 'Evidence record created', time: '30m ago', color: 'var(--fs-text-3)' },
            ].map((e, i) => (
              <div key={i} className="fs-chain-event">
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--fs-text-1)' }}>{e.action}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', marginTop: 3 }}>{e.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Anchor */}
        {selected.anchored && (
          <div className="fs-card" style={{ padding: '20px', background: 'var(--fs-chain-dim)', borderColor: 'rgba(129,140,248,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="fs-label" style={{ color: 'var(--fs-chain)', marginBottom: 8 }}>Blockchain Anchor — Polygon Mainnet</div>
                <div className="fs-hash" style={{ fontSize: '0.75rem', marginBottom: 8 }}>
                  Tx: 0x{selected.hash.slice(0, 40)}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--fs-text-2)' }}>Timestamp confirmed at block #47,829,341</div>
              </div>
              <button className="fs-btn fs-btn-ghost fs-btn-sm" style={{ color: 'var(--fs-chain)' }}>
                View on Explorer <ExternalLink size={12} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
