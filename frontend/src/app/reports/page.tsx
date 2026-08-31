import type { Metadata } from 'next'
import { FileText, Download, Link2, Filter, Activity, Box } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Report Center',
  description: 'Authenticity reports for all analyzed evidence. Download as PDF or JSON for legal use.',
}

const REPORTS = [
  { id: 'RPT-2241', case: 'INV-0047', file: 'press_conference_photo.jpg', type: 'IMAGE', score: 0.97, status: 'verified', anchored: true, created: '4m ago', size: '48 KB' },
  { id: 'RPT-2240', case: 'INV-0046', file: 'speech_clip.mp4',            type: 'VIDEO', score: 0.12, status: 'tampered', anchored: true, created: '18m ago', size: '82 KB' },
  { id: 'RPT-2238', case: 'INV-0045', file: 'studio_stems_v3.wav',        type: 'AUDIO', score: 0.99, status: 'verified', anchored: true, created: '1h ago',  size: '36 KB' },
  { id: 'RPT-2235', case: 'INV-0044', file: 'vehicle_damage_01.png',      type: 'IMAGE', score: 0.23, status: 'tampered', anchored: false, created: '2h ago',  size: '54 KB' },
  { id: 'RPT-2231', case: 'INV-0043', file: 'social_spread.mp4',          type: 'VIDEO', score: 0.88, status: 'verified', anchored: true, created: '1d ago',  size: '91 KB' },
]

export default function ReportsPage() {
  return (
    <div style={{ padding: '40px', maxWidth: 1440, margin: '0 auto' }}>
      
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="fs-label" style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <FileText size={12} color="var(--fs-text-2)" />
            FORENSIC REPORT CENTER
          </div>
          <h1 className="fs-h1">Report Packages</h1>
          <p style={{ color: 'var(--fs-text-2)', fontSize: '0.9375rem', marginTop: 12 }}>
            Cryptographically signed authenticity reports for legal and compliance use.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="fs-btn fs-btn-secondary fs-btn-sm"><Filter size={14} /> FILTER_LOGS</button>
        </div>
      </div>

      <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '24px' }}>
        <table className="fs-table">
          <thead>
            <tr>
              <th>REPORT_ID</th>
              <th>CASE_REF</th>
              <th>SOURCE_FILE</th>
              <th>TYPE</th>
              <th>AUTH_SCORE</th>
              <th>EVIDENCE_STATUS</th>
              <th>BLOCKCHAIN</th>
              <th>CREATED_AT</th>
              <th style={{ textAlign: 'right' }}>EXPORT</th>
            </tr>
          </thead>
          <tbody>
            {REPORTS.map(r => {
              const pct = Math.round(r.score * 100)
              const scoreColor = r.score > 0.7 ? 'var(--fs-verified)' : r.score > 0.4 ? 'var(--fs-uncertain)' : 'var(--fs-tampered)'
              return (
                <tr key={r.id}>
                  <td>
                    <span className="fs-mono" style={{ color: 'var(--fs-text-1)' }}>{r.id}</span>
                  </td>
                  <td><span className="fs-mono" style={{ color: 'var(--fs-text-3)' }}>{r.case}</span></td>
                  <td style={{ maxWidth: 200 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>{r.file}</div>
                  </td>
                  <td><span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-2)' }}>{r.type}</span></td>
                  <td>
                    <span className="fs-mono" style={{ fontSize: '0.8125rem', fontWeight: 500, color: scoreColor }}>{pct}%</span>
                  </td>
                  <td>
                    <span className={`fs-mono`} style={{ fontSize: '0.6875rem', color: r.status === 'verified' ? 'var(--fs-verified)' : 'var(--fs-tampered)' }}>
                      {r.status === 'verified' ? 'VERIFIED' : 'TAMPERED'}
                    </span>
                  </td>
                  <td>
                    {r.anchored
                      ? <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-chain)' }}>ANCHORED</span>
                      : <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>NONE</span>
                    }
                  </td>
                  <td style={{ color: 'var(--fs-text-3)', fontSize: '0.75rem' }} className="fs-mono">{r.created}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="fs-btn fs-btn-secondary fs-btn-sm fs-mono" style={{ padding: '0 8px', fontSize: '0.6875rem' }} title="Download PDF"><Download size={12} style={{ marginRight: 4 }} /> PDF</button>
                      <button className="fs-btn fs-btn-secondary fs-btn-sm fs-mono" style={{ padding: '0 8px', fontSize: '0.6875rem' }} title="Download JSON">JSON</button>
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
