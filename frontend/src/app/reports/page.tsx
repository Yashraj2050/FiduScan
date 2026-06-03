'use client'

import { FileText, Download, ExternalLink, Link2, Shield, Filter } from 'lucide-react'

const REPORTS = [
  { id: 'RPT-2241', case: 'INV-0047', file: 'press_conference_photo.jpg', type: 'Image', score: 0.97, status: 'verified', anchored: true, created: '4m ago', size: '48 KB' },
  { id: 'RPT-2240', case: 'INV-0046', file: 'speech_clip.mp4',            type: 'Video', score: 0.12, status: 'tampered', anchored: true, created: '18m ago', size: '82 KB' },
  { id: 'RPT-2238', case: 'INV-0045', file: 'studio_stems_v3.wav',        type: 'Audio', score: 0.99, status: 'verified', anchored: true, created: '1h ago',  size: '36 KB' },
  { id: 'RPT-2235', case: 'INV-0044', file: 'vehicle_damage_01.png',      type: 'Image', score: 0.23, status: 'tampered', anchored: false, created: '2h ago',  size: '54 KB' },
  { id: 'RPT-2231', case: 'INV-0043', file: 'social_spread.mp4',          type: 'Video', score: 0.88, status: 'verified', anchored: true, created: '1d ago',  size: '91 KB' },
]

export default function ReportsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Report Center</h1>
          <p style={{ color: 'var(--fs-text-2)', fontSize: '0.875rem' }}>Authenticity reports for all analyzed evidence. Download as PDF or JSON for legal use.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="fs-btn fs-btn-secondary fs-btn-sm"><Filter size={13} /> Filter</button>
        </div>
      </div>

      <div className="fs-card">
        <table className="fs-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Case</th>
              <th>File</th>
              <th>Type</th>
              <th>Score</th>
              <th>Status</th>
              <th>Anchored</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {REPORTS.map(r => {
              const pct = Math.round(r.score * 100)
              const scoreColor = r.score > 0.7 ? 'var(--fs-verified)' : r.score > 0.4 ? 'var(--fs-uncertain)' : 'var(--fs-tampered)'
              return (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={14} color="var(--fs-text-3)" />
                      <span className="fs-mono" style={{ color: 'var(--fs-accent-light)' }}>{r.id}</span>
                    </div>
                  </td>
                  <td><span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>{r.case}</span></td>
                  <td style={{ maxWidth: 180 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>{r.file}</div>
                  </td>
                  <td><span className="fs-badge fs-badge-neutral">{r.type}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 48, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: scoreColor, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: scoreColor, fontFamily: 'var(--font-mono)' }}>{pct}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`fs-badge ${r.status === 'verified' ? 'fs-badge-verified' : 'fs-badge-tampered'}`}>
                      {r.status === 'verified' ? '✓ Authentic' : '⚠ Tampered'}
                    </span>
                  </td>
                  <td>
                    {r.anchored
                      ? <span className="fs-badge fs-badge-chain"><Link2 size={9} /> Yes</span>
                      : <span className="fs-badge fs-badge-neutral">No</span>
                    }
                  </td>
                  <td style={{ color: 'var(--fs-text-3)', fontSize: '0.75rem' }}>{r.created}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="fs-btn fs-btn-ghost fs-btn-sm" title="Download PDF"><Download size={13} /> PDF</button>
                      <button className="fs-btn fs-btn-ghost fs-btn-sm" title="Download JSON">JSON</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
