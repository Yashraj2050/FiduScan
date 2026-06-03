'use client'

import { useState } from 'react'
import { Upload, Droplets, CheckCircle2, XCircle, AlertTriangle, ImageIcon, Music, Video, Shield } from 'lucide-react'

type MediaType = 'image' | 'audio' | 'video'
type Action = 'embed' | 'extract' | 'verify'

const MOCK_RESULT = {
  embed: { status: 'success', watermarkId: 'wm_a9f3c2d1e045', payload: 'fiduscan:inv-0047:analyst-a:1748953412', message: 'Watermark embedded successfully. Payload is imperceptible to human senses.' },
  extract: { status: 'verified', watermarkId: 'wm_a9f3c2d1e045', payload: 'fiduscan:inv-0047:analyst-a:1748953412', message: 'Watermark extracted and payload decoded. Integrity: intact.' },
  verify: { status: 'verified', confidence: 0.983, integrityStatus: 'intact', message: 'Watermark signature matches original payload. No tampering detected.' },
}

export default function WatermarkPage() {
  const [mediaType, setMediaType] = useState<MediaType>('image')
  const [action, setAction] = useState<Action>('embed')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<string | null>(null)
  const [result, setResult] = useState<typeof MOCK_RESULT[Action] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    setFile('sample_file_dropped.jpg')
    setResult(null)
  }

  const handleProcess = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setResult(MOCK_RESULT[action])
    setLoading(false)
  }

  const MEDIA_ICONS: Record<MediaType, React.ComponentType<any>> = {
    image: ImageIcon, audio: Music, video: Video
  }
  const MediaIcon = MEDIA_ICONS[mediaType]

  return (
    <div style={{ padding: '32px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Watermark Studio</h1>
        <p style={{ color: 'var(--fs-text-2)', fontSize: '0.875rem' }}>Embed, extract, and verify forensic watermarks across Image, Audio, and Video media.</p>
      </div>

      {/* Media Type */}
      <div style={{ marginBottom: 20 }}>
        <div className="fs-label" style={{ marginBottom: 10 }}>Media Type</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {(['image','audio','video'] as MediaType[]).map(t => {
            const Icon = MEDIA_ICONS[t]
            return (
              <button
                key={t}
                onClick={() => { setMediaType(t); setFile(null); setResult(null) }}
                className={`fs-btn ${mediaType === t ? 'fs-btn-primary' : 'fs-btn-secondary'}`}
              >
                <Icon size={14} /> {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Action */}
      <div style={{ marginBottom: 28 }}>
        <div className="fs-label" style={{ marginBottom: 10 }}>Operation</div>
        <div className="fs-tabs" style={{ maxWidth: 360 }}>
          {(['embed','extract','verify'] as Action[]).map(a => (
            <button key={a} className={`fs-tab ${action === a ? 'active' : ''}`} onClick={() => { setAction(a); setResult(null) }} style={{ textTransform: 'capitalize' }}>{a}</button>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`fs-upload-zone ${dragging ? 'drag-over' : ''}`}
        style={{ padding: '60px 40px', textAlign: 'center', marginBottom: 24 }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => { setFile('sample_media_selected.jpg'); setResult(null) }}
      >
        {file ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--fs-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MediaIcon size={22} color="var(--fs-accent)" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{file}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)' }}>Ready to {action}</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--fs-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Upload size={22} color="var(--fs-text-3)" />
            </div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Drop {mediaType} file here</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--fs-text-3)' }}>
              {mediaType === 'image' ? 'PNG, JPG, WebP — up to 50MB' : mediaType === 'audio' ? 'WAV, MP3, FLAC — up to 200MB' : 'MP4, MOV, WebM — up to 1GB'}
            </div>
          </div>
        )}
      </div>

      {/* Payload field (only for embed) */}
      {action === 'embed' && (
        <div style={{ marginBottom: 20 }}>
          <div className="fs-label" style={{ marginBottom: 8 }}>Watermark Payload (auto-generated)</div>
          <input className="fs-input" readOnly value="fiduscan:inv-0047:analyst-a:1748953412" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }} />
        </div>
      )}

      {/* Process Button */}
      <button
        className="fs-btn fs-btn-primary"
        style={{ marginBottom: 28, opacity: file ? 1 : 0.5 }}
        onClick={file ? handleProcess : undefined}
        disabled={loading}
        aria-busy={loading}
        aria-disabled={!file}
      >
        <Droplets size={14} />
        {loading ? 'Processing…' : action === 'embed' ? 'Embed Watermark' : action === 'extract' ? 'Extract Watermark' : 'Verify Watermark'}
      </button>

      {/* Result */}
      <div aria-live="polite" aria-atomic="true">
      {result && (
        <div className="fs-card animate-fade-up" style={{
          padding: '24px',
          borderColor: 'status' in result && result.status === 'verified' ? 'rgba(34,197,94,0.3)' : 'rgba(79,110,247,0.3)',
          background: 'status' in result && result.status === 'verified' ? 'var(--fs-verified-dim)' : 'var(--fs-accent-dim)',
        }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <CheckCircle2 size={22} color="var(--fs-verified)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9375rem' }}>{result.message}</div>
              {'watermarkId' in result && (
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div className="fs-label" style={{ marginBottom: 4 }}>Watermark ID</div>
                    <span className="fs-mono" style={{ color: 'var(--fs-chain)' }}>{result.watermarkId}</span>
                  </div>
                  {'payload' in result && (
                    <div>
                      <div className="fs-label" style={{ marginBottom: 4 }}>Decoded Payload</div>
                      <span className="fs-mono" style={{ color: 'var(--fs-text-2)' }}>{result.payload}</span>
                    </div>
                  )}
                </div>
              )}
              {'confidence' in result && (
                <div style={{ marginTop: 10 }}>
                  <div className="fs-label" style={{ marginBottom: 4 }}>Verification Confidence</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                      <div style={{ width: `${result.confidence * 100}%`, height: '100%', background: 'var(--fs-verified)', borderRadius: 99, boxShadow: '0 0 8px var(--fs-verified)' }} />
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--fs-verified)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{Math.round(result.confidence * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

