'use client'
import { useState } from 'react'
import { Shield, Link2, Filter, Copy, ExternalLink, Activity, Network, ScanLine, FileTerminal } from 'lucide-react'

const EVIDENCE = [
  { id: 'EV-8821', type: 'IMAGE', file: 'press_conference_photo.jpg', hash: 'a7f3c9d2e1b045983c78e2f1d9a04b2c3e15f8d7a09c1b3e2f4d67890abcdef1', score: 0.97, status: 'verified', anchored: true, watermark: 'verified', case: 'INV-0047' },
  { id: 'EV-8820', type: 'VIDEO', file: 'speech_clip.mp4',            hash: 'f1e2d3c4b5a69780917263540817263abcdef1234567890abcdef1234567890ab', score: 0.12, status: 'tampered', anchored: true, watermark: 'missing', case: 'INV-0046' },
  { id: 'EV-8818', type: 'AUDIO', file: 'studio_stems_v3.wav',        hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12', score: 0.99, status: 'verified', anchored: true, watermark: 'verified', case: 'INV-0045' },
  { id: 'EV-8815', type: 'IMAGE', file: 'vehicle_damage_01.png',      hash: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab', score: 0.23, status: 'tampered', anchored: false, watermark: 'missing', case: 'INV-0044' },
  { id: 'EV-8812', type: 'VIDEO', file: 'social_spread.mp4',          hash: 'deadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678ab', score: 0.88, status: 'verified', anchored: true, watermark: 'embedded', case: 'INV-0043' },
]

export default function EvidencePage() {
  const [selected, setSelected] = useState(EVIDENCE[0])

  return (
    <div style={{ height: '100%', display: 'flex' }}>

      {/* Evidence List */}
      <aside style={{ width: 360, flexShrink: 0, borderRight: '1px solid var(--fs-border)', display: 'flex', flexDirection: 'column', background: 'var(--fs-surface)' }} role="complementary" aria-label="Evidence list">
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--fs-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="fs-h3">Evidence Vault</h2>
            <button className="fs-btn fs-btn-ghost fs-btn-sm" style={{ padding: '0 8px' }}><Filter size={14} /></button>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {['ALL','IMAGE','VIDEO','AUDIO'].map(f => (
              <button key={f} className="fs-btn fs-btn-ghost fs-btn-sm fs-mono" style={{ fontSize: '0.6875rem', padding: '0 8px', color: 'var(--fs-text-3)' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {EVIDENCE.map(e => (
            <div
              key={e.id}
              onClick={() => setSelected(e)}
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--fs-border)',
                cursor: 'pointer',
                background: selected.id === e.id ? 'var(--fs-panel)' : 'transparent',
                borderLeft: selected.id === e.id ? '2px solid var(--fs-text-1)' : '2px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="fs-mono" style={{ color: selected.id === e.id ? 'var(--fs-text-1)' : 'var(--fs-text-3)' }}>{e.id}</span>
                <span className={`fs-mono`} style={{ fontSize: '0.6875rem', color: e.status === 'verified' ? 'var(--fs-verified)' : 'var(--fs-tampered)' }}>
                  {e.status === 'verified' ? 'VERIFIED' : 'TAMPERED'}
                </span>
              </div>
              <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--fs-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.file}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
                <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-2)', background: 'var(--fs-bg)', padding: '2px 4px', border: '1px solid var(--fs-border)' }}>{e.type}</span>
                {e.anchored && <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-chain)', background: 'var(--fs-chain-dim)', padding: '2px 4px', border: '1px solid var(--fs-chain-dim)' }}>ON-CHAIN</span>}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Evidence Detail */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px', background: 'var(--fs-bg)' }}>
        
        {/* Header Block */}
        <div style={{ marginBottom: 48, borderBottom: '1px solid var(--fs-border)', paddingBottom: 32 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>ID: {selected.id}</span>
            <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>/</span>
            <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>CASE: {selected.case}</span>
            <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>/</span>
            <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>TYPE: {selected.type}</span>
            {selected.anchored && (
              <>
                <span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>/</span>
                <span className="fs-mono" style={{ color: 'var(--fs-chain)' }}>ANCHORED</span>
              </>
            )}
          </div>
          
          <h1 className="fs-h1" style={{ marginBottom: 24 }}>{selected.file}</h1>
          
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="fs-label">AUTHENTICITY</span>
              <span className="fs-mono" style={{ fontSize: '2rem', color: selected.score > 0.8 ? 'var(--fs-verified)' : 'var(--fs-tampered)' }}>
                {Math.round(selected.score * 100)}%
              </span>
            </div>
            
            <div style={{ width: 1, height: 40, background: 'var(--fs-border-strong)' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="fs-label">STATUS</span>
              <span className="fs-mono" style={{ fontSize: '1.25rem', color: selected.status === 'verified' ? 'var(--fs-verified)' : 'var(--fs-tampered)' }}>
                {selected.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Data Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
          
          {/* Hashes */}
          <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '24px' }}>
            <div className="fs-label" style={{ marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
              <FileTerminal size={14} color="var(--fs-text-2)" />
              INTEGRITY HASHES
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['SHA-256 (FILE)', 'SHA-256 (METADATA)', 'ANCHOR HASH'].map((label, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="fs-mono" style={{ fontSize: '0.8125rem', color: 'var(--fs-text-1)', wordBreak: 'break-all' }}>
                      {selected.hash.slice(0, i * 8 + 16)}...{selected.hash.slice(-12)}
                    </span>
                    <button className="fs-btn fs-btn-ghost fs-btn-sm" style={{ padding: '0 4px', minWidth: 'auto' }}>
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis */}
          <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '24px' }}>
            <div className="fs-label" style={{ marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
              <ScanLine size={14} color="var(--fs-text-2)" />
              AI ANALYSIS MODEL
            </div>
            
            <table className="fs-table" style={{ marginTop: -12 }}>
              <tbody>
                <tr>
                  <th style={{ borderBottom: 'none', width: 140 }}>MODEL</th>
                  <td style={{ borderBottom: 'none' }} className="fs-mono">SWIN_TRANSFORMER_V3</td>
                </tr>
                <tr>
                  <th style={{ borderBottom: 'none' }}>CONFIDENCE</th>
                  <td style={{ borderBottom: 'none' }} className="fs-mono">96.8%</td>
                </tr>
                <tr>
                  <th style={{ borderBottom: 'none' }}>PROCESSING</th>
                  <td style={{ borderBottom: 'none' }} className="fs-mono">842 ms</td>
                </tr>
                <tr>
                  <th style={{ borderBottom: 'none' }}>DETECTION</th>
                  <td style={{ borderBottom: 'none' }} className="fs-mono">
                    {selected.status === 'verified' ? 'CLEAN' : 'COMPRESSION_ARTIFACT_ANOMALY'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Chain of Custody */}
        <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '24px', marginBottom: 32 }}>
          <div className="fs-label" style={{ marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
            <Network size={14} color="var(--fs-text-2)" />
            CHAIN OF CUSTODY
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--fs-border-strong)' }}>
            {[
              { action: 'BLOCKCHAIN_ANCHOR_CONFIRMED', detail: 'Polygon Mainnet', time: '14:32:01 UTC', status: 'var(--fs-chain)' },
              { action: 'AUTHENTICITY_REPORT_GENERATED', detail: 'System Auto', time: '14:24:12 UTC', status: 'var(--fs-text-1)' },
              { action: 'WATERMARK_VERIFICATION', detail: 'Passed', time: '14:18:44 UTC', status: 'var(--fs-verified)' },
              { action: 'EVIDENCE_RECORD_CREATED', detail: 'Investigator (FS-9021)', time: '14:06:59 UTC', status: 'var(--fs-text-2)' },
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, background: 'var(--fs-panel)', padding: '16px' }}>
                <span className="fs-mono" style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', width: 120 }}>{e.time}</span>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="fs-mono" style={{ fontSize: '0.8125rem', color: e.status }}>{e.action}</span>
                  <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>{e.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Anchor */}
        {selected.anchored && (
          <div style={{ padding: '20px 24px', border: '1px solid var(--fs-chain)', background: 'var(--fs-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="fs-mono" style={{ color: 'var(--fs-chain)', fontSize: '0.6875rem', marginBottom: 8 }}>BLOCKCHAIN ANCHOR — POLYGON MAINNET</div>
                <div className="fs-mono" style={{ fontSize: '0.8125rem', color: 'var(--fs-text-1)', marginBottom: 8 }}>
                  TX: 0x{selected.hash.slice(0, 64)}
                </div>
                <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>CONFIRMED AT BLOCK #47,829,341</div>
              </div>
              <button className="fs-btn fs-btn-ghost fs-btn-sm" style={{ color: 'var(--fs-chain)' }}>
                VIEW ON EXPLORER <ExternalLink size={12} />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
