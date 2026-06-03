'use client'

import { CreditCard, Zap, Shield, ChevronRight, Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Free', price: '$0', period: '/mo',
    features: ['10 scans/month', 'Basic detection', 'No PDF reports', 'No blockchain anchoring'],
    current: false, cta: 'Current Plan', accent: 'var(--fs-text-3)',
  },
  {
    name: 'Pro', price: '$199', period: '/mo',
    features: ['1,000 scans/month', 'All media types', 'PDF & JSON reports', '3 team seats', 'Priority support'],
    current: true, cta: 'Current Plan', accent: 'var(--fs-accent)',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    features: ['Unlimited scans', 'Blockchain anchoring', 'Advanced Case Management', 'Unlimited seats', 'Dedicated CSM', 'SLA'],
    current: false, cta: 'Contact Sales', accent: 'var(--fs-chain)',
  },
]

export default function BillingPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Billing</h1>
        <p style={{ color: 'var(--fs-text-2)', fontSize: '0.875rem' }}>Manage your subscription, usage, and payment details.</p>
      </div>

      {/* Current Usage */}
      <div className="fs-card" style={{ padding: '24px', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div className="fs-label" style={{ marginBottom: 4 }}>Current Billing Period</div>
            <div style={{ fontWeight: 600, fontSize: '1.0625rem' }}>June 2025</div>
          </div>
          <span className="fs-badge fs-badge-verified"><Zap size={10} /> Pro Active</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            { label: 'Scans Used', current: 312, limit: 1000, color: 'var(--fs-accent)' },
            { label: 'Reports Generated', current: 45, limit: null, color: 'var(--fs-verified)' },
          ].map((u, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--fs-text-2)' }}>{u.label}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  {u.current}{u.limit ? ` / ${u.limit}` : ' total'}
                </span>
              </div>
              {u.limit && (
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                  <div style={{ width: `${(u.current / u.limit) * 100}%`, height: '100%', background: u.color, borderRadius: 99 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="fs-label" style={{ marginBottom: 20 }}>Plans</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
        {PLANS.map((p, i) => (
          <div key={i} className="fs-card" style={{
            padding: '24px',
            borderColor: p.current ? `${p.accent}40` : 'var(--fs-border)',
            background: p.current ? `${p.accent}08` : 'var(--fs-panel)',
          }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: p.accent, marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.04em' }}>{p.price}</span>
                {p.period && <span style={{ fontSize: '0.875rem', color: 'var(--fs-text-3)' }}>{p.period}</span>}
              </div>
            </div>
            <ul style={{ listStyle: 'none', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {p.features.map((f, fi) => (
                <li key={fi} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Check size={13} color={p.accent} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--fs-text-2)' }}>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`fs-btn ${p.current ? 'fs-btn-secondary' : 'fs-btn-primary'} fs-btn-sm`}
              style={{ width: '100%', justifyContent: 'center', opacity: p.current ? 0.6 : 1 }}
              disabled={p.current}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="fs-card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <CreditCard size={20} color="var(--fs-text-3)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Visa ending in 4242</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', marginTop: 2 }}>Expires 08/2027 · Next billing: July 1, 2025</div>
            </div>
          </div>
          <button className="fs-btn fs-btn-secondary fs-btn-sm">Update Card</button>
        </div>
      </div>
    </div>
  )
}
