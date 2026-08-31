import type { Metadata } from 'next'
import { CreditCard, Shield, Check, FileTerminal, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Billing | FiduScan',
  description: 'Manage your FiduScan subscription, usage quota, and payment details.',
}

const PLANS = [
  {
    name: 'BASIC', price: '$0', period: '/MO',
    features: ['10 VERIFICATIONS/MO', 'STANDARD_DETECTION', 'NO_REPORTS', 'NO_ANCHORING'],
    current: false, cta: 'CURRENT_TIER', accent: 'var(--fs-text-3)',
  },
  {
    name: 'PROFESSIONAL', price: '$199', period: '/MO',
    features: ['1,000 VERIFICATIONS/MO', 'ALL_MEDIA_TYPES', 'PDF/JSON_REPORTS', '3_INVESTIGATOR_SEATS', 'PRIORITY_SUPPORT'],
    current: true, cta: 'CURRENT_TIER', accent: 'var(--fs-text-1)',
  },
  {
    name: 'ENTERPRISE', price: 'CUSTOM', period: '',
    features: ['UNLIMITED_VERIFICATIONS', 'POLYGON_ANCHORING', 'ADVANCED_CASE_MGMT', 'UNLIMITED_SEATS', 'DEDICATED_CSM', 'SLA_99.9%'],
    current: false, cta: 'CONTACT_SALES', accent: 'var(--fs-chain)',
  },
]

export default function BillingPage() {
  return (
    <div style={{ padding: '40px', maxWidth: 1000, margin: '0 auto' }}>
      
      <div style={{ marginBottom: 40 }}>
        <div className="fs-label" style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <CreditCard size={12} color="var(--fs-text-2)" />
          RESOURCE ALLOCATION & BILLING
        </div>
        <h1 className="fs-h1">Account Resources</h1>
      </div>

      {/* Current Usage */}
      <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '32px', marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginBottom: 8 }}>BILLING_CYCLE</div>
            <div className="fs-mono" style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--fs-text-1)' }}>JUNE 2026</div>
          </div>
          <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-verified)', background: 'var(--fs-verified-dim)', padding: '4px 8px', border: '1px solid var(--fs-verified-dim)' }}>PRO_TIER_ACTIVE</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {[
            { label: 'EVIDENCE_VERIFICATIONS', current: 312, limit: 1000, color: 'var(--fs-text-1)' },
            { label: 'FORENSIC_REPORTS_EXPORTED', current: 45, limit: null, color: 'var(--fs-text-1)' },
          ].map((u, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="fs-mono" style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)' }}>{u.label}</span>
                <span className="fs-mono" style={{ fontSize: '0.75rem', color: 'var(--fs-text-1)' }}>
                  {u.current}{u.limit ? ` / ${u.limit}` : ' (UNLIMITED)'}
                </span>
              </div>
              {u.limit && (
                <div style={{ height: 2, background: 'var(--fs-border)' }}>
                  <div style={{ width: `${(u.current / u.limit) * 100}%`, height: '100%', background: u.color }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="fs-label" style={{ marginBottom: 16 }}>AVAILABLE_TIERS</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--fs-border)', marginBottom: 40 }}>
        {PLANS.map((p, i) => (
          <div key={i} style={{
            background: p.current ? 'var(--fs-elevated)' : 'var(--fs-panel)',
            padding: '32px 24px',
          }}>
            <div style={{ marginBottom: 24, borderBottom: '1px solid var(--fs-border)', paddingBottom: 24 }}>
              <div className="fs-mono" style={{ fontSize: '0.75rem', color: p.accent, marginBottom: 8 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="fs-mono" style={{ fontSize: '2rem', color: 'var(--fs-text-1)' }}>{p.price}</span>
                {p.period && <span className="fs-mono" style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)' }}>{p.period}</span>}
              </div>
            </div>
            
            <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {p.features.map((f, fi) => (
                <li key={fi} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Check size={14} color={p.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-2)' }}>{f}</span>
                </li>
              ))}
            </ul>
            
            <button
              className={`fs-btn fs-mono ${p.current ? 'fs-btn-ghost' : 'fs-btn-secondary'} fs-btn-sm`}
              style={{ width: '100%', fontSize: '0.6875rem' }}
              disabled={p.current}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <FileTerminal size={20} color="var(--fs-text-3)" />
            <div>
              <div className="fs-mono" style={{ fontSize: '0.8125rem', color: 'var(--fs-text-1)', marginBottom: 4 }}>PAYMENT_METHOD: VISA **** 4242</div>
              <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>EXP_08/27 | NEXT_BILLING: 2026-07-01</div>
            </div>
          </div>
          <button className="fs-btn fs-btn-secondary fs-btn-sm fs-mono" style={{ fontSize: '0.6875rem' }}>UPDATE_METHOD</button>
        </div>
      </div>
    </div>
  )
}
