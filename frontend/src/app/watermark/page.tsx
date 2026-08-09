'use client'
import { useState } from 'react'
import { Upload, Droplets, CheckCircle2, ShieldAlert, FileTerminal, Network, Terminal } from 'lucide-react'

type MediaType = 'image' | 'audio' | 'video'
type Action = 'embed' | 'extract' | 'verify'

const MOCK_RESULT = {
  embed: { status: 'success', watermarkId: 'wm_a9f3c2d1e045', payload: 'fiduscan:inv-0047:analyst-a:1748953412', message: 'WATERMARK_INJECTED' },
  extract: { status: 'verified', watermarkId: 'wm_a9f3c2d1e045', payload: 'fiduscan:inv-0047:analyst-a:1748953412', message: 'WATERMARK_EXTRACTED' },
  verify: { status: 'verified', confidence: 0.983, integrityStatus: 'intact', message: 'SIGNATURE_VERIFIED' },
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
    setFile('EVIDENCE_RAW_738.DAT')
    setResult(null)
  }

  const handleProcess = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000)) // Faster for "technical" feel
    setResult(MOCK_RESULT[action])
    setLoading(false)
  }

  return (
    <div style={{ padding: '40px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <div className="fs-label" style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Droplets size={12} color="var(--fs-text-2)" />
          CRYPTOGRAPHIC WATERMARK PROTOCOL
        </div>
        <h1 className="fs-h1">Watermark Engine</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
        {/* Media Type */}
        <div>
          <div className="fs-label" style={{ marginBottom: 12 }}>TARGET_MEDIA</div>
          <div style={{ display: 'flex', gap: 2 }}>
            {(['image','audio','video'] as MediaType[]).map(t => (
              <button
                key={t}
                onClick={() => { setMediaType(t); setFile(null); setResult(null) }}
                className={`fs-btn fs-mono ${mediaType === t ? 'fs-btn-primary' : 'fs-btn-ghost'}`}
                style={{ fontSize: '0.6875rem', padding: '0 16px', borderRadius: 0, border: mediaType === t ? '1px solid var(--fs-text-1)' : '1px solid var(--fs-border)' }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Action */}
        <div>
          <div className="fs-label" style={{ marginBottom: 12 }}>EXECUTION_MODE</div>
          <div style={{ display: 'flex', gap: 2 }}>
            {(['embed','extract','verify'] as Action[]).map(a => (
              <button 
                key={a} 
                className={`fs-btn fs-mono ${action === a ? 'fs-btn-primary' : 'fs-btn-ghost'}`} 
                onClick={() => { setAction(a); setResult(null) }} 
                style={{ fontSize: '0.6875rem', padding: '0 16px', borderRadius: 0, border: action === a ? '1px solid var(--fs-text-1)' : '1px solid var(--fs-border)' }}
              >
                {a.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        style={{ 
          padding: '80px 40px', 
          textAlign: 'center', 
          marginBottom: 32,
          background: dragging ? 'var(--fs-panel)' : 'var(--fs-surface)',
          border: dragging ? '1px dashed var(--fs-text-1)' : '1px solid var(--fs-border)',
          cursor: 'pointer',
          transition: 'all var(--t-fast)'
        }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => { setFile('EVIDENCE_RAW_738.DAT'); setResult(null) }}
      >
        {file ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <FileTerminal size={24} color="var(--fs-text-1)" />
            <div>
              <div className="fs-mono" style={{ fontWeight: 500, fontSize: '0.9375rem', color: 'var(--fs-text-1)' }}>{file}</div>
              <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginTop: 8 }}>MOUNTED — READY FOR {action.toUpperCase()}</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Upload size={24} color="var(--fs-text-3)" />
            <div>
              <div className="fs-mono" style={{ fontWeight: 500, fontSize: '0.8125rem', color: 'var(--fs-text-2)' }}>DRAG MEDIA HERE OR CLICK TO BROWSE</div>
              <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginTop: 8 }}>
                {mediaType === 'image' ? 'PNG, JPG, WEBP / MAX: 50MB' : mediaType === 'audio' ? 'WAV, MP3, FLAC / MAX: 200MB' : 'MP4, MOV, WEBM / MAX: 1GB'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payload field */}
      {action === 'embed' && (
        <div style={{ marginBottom: 32 }}>
          <div className="fs-label" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>PAYLOAD_INJECTION_DATA</span>
            <span>AUTO_GENERATED</span>
          </div>
          <input className="fs-input fs-mono" readOnly value="fiduscan:inv-0047:analyst-a:1748953412" style={{ background: 'var(--fs-panel)', border: '1px solid var(--fs-border-strong)' }} />
        </div>
      )}

      {/* Process Button */}
      <button
        className="fs-btn fs-btn-primary fs-btn-lg fs-mono"
        style={{ width: '100%', marginBottom: 40, opacity: file ? 1 : 0.5, letterSpacing: '0.05em' }}
        onClick={file ? handleProcess : undefined}
        disabled={loading}
      >
        <Terminal size={14} style={{ marginRight: 8 }} />
        {loading ? 'EXECUTING...' : `INITIATE_${action.toUpperCase()}_SEQUENCE`}
      </button>

      {/* Result */}
      {result && (
        <div className="animate-slide-up" style={{
          padding: '32px',
          border: '1px solid var(--fs-border-strong)',
          background: 'var(--fs-surface)',
          borderLeft: `2px solid ${'status' in result && result.status === 'verified' || result.status === 'success' ? 'var(--fs-verified)' : 'var(--fs-tampered)'}`
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <CheckCircle2 size={18} color={'status' in result && result.status === 'verified' || result.status === 'success' ? 'var(--fs-verified)' : 'var(--fs-tampered)'} style={{ marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div className="fs-mono" style={{ fontWeight: 600, marginBottom: 24, fontSize: '0.875rem', color: 'var(--fs-text-1)' }}>{result.message}</div>
              
              {'watermarkId' in result && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '16px', background: 'var(--fs-bg)', border: '1px solid var(--fs-border)' }}>
                  <div>
                    <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginBottom: 8 }}>WATERMARK_ID</div>
                    <span className="fs-mono" style={{ color: 'var(--fs-text-1)', fontSize: '0.8125rem' }}>{result.watermarkId}</span>
                  </div>
                  {'payload' in result && (
                    <div>
                      <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginBottom: 8 }}>DECODED_PAYLOAD</div>
                      <span className="fs-mono" style={{ color: 'var(--fs-chain)', fontSize: '0.8125rem' }}>{result.payload}</span>
                    </div>
                  )}
                </div>
              )}

              {'confidence' in result && (
                <div style={{ marginTop: 24, padding: '16px', background: 'var(--fs-bg)', border: '1px solid var(--fs-border)' }}>
                  <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginBottom: 12 }}>VERIFICATION_CONFIDENCE</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, height: 2, background: 'var(--fs-border)' }}>
                      <div style={{ width: `${result.confidence * 100}%`, height: '100%', background: 'var(--fs-verified)' }} />
                    </div>
                    <span className="fs-mono" style={{ fontWeight: 500, color: 'var(--fs-verified)', fontSize: '0.875rem' }}>{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
