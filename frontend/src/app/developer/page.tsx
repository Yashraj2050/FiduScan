'use client'
import { useState } from 'react'
import { Key, Webhook, BarChart3, BookOpen, Plus, Copy, RotateCcw, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react'

const API_KEYS = [
  { id: 'key_1', name: 'Production API', key: 'fsk_prod_a9f3c2d1e04598', created: '2025-05-10', requests: 4820, active: true },
  { id: 'key_2', name: 'Staging API',    key: 'fsk_stag_b3e2f1a0c94712', created: '2025-06-01', requests: 312, active: true },
]

const WEBHOOKS = [
  { id: 'wh_1', url: 'https://myapp.example.com/webhooks/fiduscan', active: true, deliveries: 128 },
]

const USAGE = [
  { day: 'Mon', requests: 480 }, { day: 'Tue', requests: 620 },
  { day: 'Wed', requests: 390 }, { day: 'Thu', requests: 850 },
  { day: 'Fri', requests: 720 }, { day: 'Sat', requests: 210 },
  { day: 'Sun', requests: 150 },
]

const maxR = Math.max(...USAGE.map(u => u.requests))

export default function DeveloperPage() {
  const [tab, setTab] = useState<'keys'|'webhooks'|'usage'|'docs'>('keys')
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})

  return (
    <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Developer Portal</h1>
        <p style={{ color: 'var(--fs-text-2)', fontSize: '0.875rem' }}>Manage API keys, webhooks, and monitor usage for programmatic access to FiduScan.</p>
      </div>

      {/* Tabs */}
      <div className="fs-tabs" style={{ maxWidth: 480, marginBottom: 28 }}>
        {([
          { id: 'keys', icon: Key, label: 'API Keys' },
          { id: 'webhooks', icon: Webhook, label: 'Webhooks' },
          { id: 'usage', icon: BarChart3, label: 'Usage' },
          { id: 'docs', icon: BookOpen, label: 'Docs' },
        ] as const).map(t => (
          <button key={t.id} className={`fs-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {/* API Keys */}
      {tab === 'keys' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="fs-btn fs-btn-primary fs-btn-sm"><Plus size={13} /> Create Key</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {API_KEYS.map(k => (
              <div key={k.id} className="fs-card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{k.name}</span>
                      <span className={`fs-badge ${k.active ? 'fs-badge-verified' : 'fs-badge-neutral'}`}>{k.active ? 'Active' : 'Revoked'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="fs-mono" style={{ letterSpacing: '0.05em' }}>
                        {showKey[k.id] ? k.key : k.key.slice(0, 12) + '••••••••••••••••'}
                      </span>
                      <button className="fs-btn fs-btn-ghost fs-btn-sm" onClick={() => setShowKey(p => ({ ...p, [k.id]: !p[k.id] }))}>
                        {showKey[k.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <button className="fs-btn fs-btn-ghost fs-btn-sm"><Copy size={12} /></button>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', marginTop: 8 }}>
                      Created {k.created} · {k.requests.toLocaleString()} requests
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="fs-btn fs-btn-secondary fs-btn-sm"><RotateCcw size={12} /> Rotate</button>
                    <button className="fs-btn fs-btn-danger fs-btn-sm"><Trash2 size={12} /> Revoke</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Webhooks */}
      {tab === 'webhooks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="fs-btn fs-btn-primary fs-btn-sm"><Plus size={13} /> Add Webhook</button>
          </div>
          {WEBHOOKS.map(w => (
            <div key={w.id} className="fs-card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <span className={`fs-badge ${w.active ? 'fs-badge-verified' : 'fs-badge-neutral'}`}>{w.active ? 'Active' : 'Inactive'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)' }}>{w.deliveries} deliveries</span>
                  </div>
                  <span className="fs-mono" style={{ color: 'var(--fs-text-2)' }}>{w.url}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="fs-btn fs-btn-secondary fs-btn-sm">Test</button>
                  <button className="fs-btn fs-btn-danger fs-btn-sm"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usage */}
      {tab === 'usage' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Total Requests', value: '5,132' },
              { label: 'Scans', value: '1,847' },
              { label: 'Reports', value: '312' },
              { label: 'Evidence Records', value: '489' },
            ].map((s, i) => (
              <div key={i} className="fs-stat-card">
                <div className="fs-label" style={{ marginBottom: 8 }}>{s.label}</div>
                <div className="fs-stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="fs-card" style={{ padding: '24px' }}>
            <div className="fs-label" style={{ marginBottom: 20 }}>Daily Requests (Last 7 Days)</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 140 }}>
              {USAGE.map((u, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>{u.requests}</div>
                  <div style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    background: `linear-gradient(to top, var(--fs-accent), var(--fs-chain))`,
                    height: `${(u.requests / maxR) * 100}%`,
                    minHeight: 4,
                    opacity: 0.8,
                  }} />
                  <div style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>{u.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Docs */}
      {tab === 'docs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { title: 'REST API Reference', desc: 'Complete OpenAPI 3.0 documentation for all detection, watermarking, evidence, and blockchain endpoints.', href: '/api/docs' },
            { title: 'Authentication Guide', desc: 'Understand API key scoping, Bearer tokens, and rate limiting policies.', href: '/api/docs#auth' },
            { title: 'Webhook Guide', desc: 'Configure webhooks for real-time events: scan.complete, anchor.confirmed, case.updated.', href: '/api/docs#webhooks' },
            { title: 'SDK Reference', desc: 'Python and Node.js SDK usage examples for programmatic access to the FiduScan platform.', href: '/api/docs#sdk' },
          ].map((d, i) => (
            <a key={i} href={d.href} style={{ textDecoration: 'none' }}>
              <div className="fs-card fs-card-interactive" style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{d.title}</h3>
                  <ExternalLink size={14} color="var(--fs-text-3)" />
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--fs-text-2)', lineHeight: 1.6 }}>{d.desc}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
