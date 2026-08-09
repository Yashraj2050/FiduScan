'use client'
import { User, Users, Bell, Shield, Terminal, Fingerprint, Network, Settings } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [tab, setTab] = useState<'profile'|'team'|'notifications'|'security'>('profile')

  return (
    <div style={{ padding: '40px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <div className="fs-label" style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Settings size={12} color="var(--fs-text-2)" />
          SYSTEM CONFIGURATION
        </div>
        <h1 className="fs-h1">Account Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40 }}>
        {/* Navigation Sidebar */}
        <aside>
          <div className="fs-label" style={{ marginBottom: 16 }}>CONFIGURATION_NODES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {([
              { id: 'profile', icon: User, label: 'USER_PROFILE' },
              { id: 'team', icon: Users, label: 'ACCESS_CONTROL' },
              { id: 'notifications', icon: Bell, label: 'SYSTEM_ALERTS' },
              { id: 'security', icon: Shield, label: 'SECURITY_PROTOCOLS' },
            ] as const).map(t => (
              <button 
                key={t.id} 
                className={`fs-btn fs-mono ${tab === t.id ? 'fs-btn-primary' : 'fs-btn-ghost'}`} 
                onClick={() => setTab(t.id)}
                style={{ justifyContent: 'flex-start', padding: '12px 16px', borderRadius: 0, borderLeft: tab === t.id ? '2px solid var(--fs-text-1)' : '2px solid transparent' }}
              >
                <t.icon size={14} style={{ marginRight: 8 }} /> {t.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Tab Content */}
        <main>
          {tab === 'profile' && (
            <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '40px' }}>
              <div className="fs-label" style={{ marginBottom: 32, display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid var(--fs-border)', paddingBottom: 16 }}>
                <Fingerprint size={14} color="var(--fs-text-2)" />
                IDENTITY VERIFICATION
              </div>
              
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 40 }}>
                <div style={{
                  width: 64, height: 64, background: 'var(--fs-text-1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 600, color: 'var(--fs-text-inverse)'
                }}>A</div>
                <div>
                  <div className="fs-mono" style={{ fontWeight: 500, fontSize: '1.25rem', color: 'var(--fs-text-1)', marginBottom: 4 }}>ANALYST_A</div>
                  <div className="fs-mono" style={{ fontSize: '0.8125rem', color: 'var(--fs-text-2)' }}>ID: USER-9941-XYZ</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-verified)', background: 'var(--fs-verified-dim)', padding: '2px 4px', border: '1px solid var(--fs-verified-dim)' }}>CLEARANCE: LEVEL_4</span>
                    <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', background: 'var(--fs-bg)', padding: '2px 4px', border: '1px solid var(--fs-border)' }}>ROLE: SENIOR_INVESTIGATOR</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { label: 'OPERATIVE_NAME', value: 'Analyst A' },
                  { label: 'CONTACT_VECTOR', value: 'analyst@forensics.system' },
                  { label: 'ASSIGNED_UNIT', value: 'Cyber Forensics Division' },
                ].map((f, i) => (
                  <div key={i}>
                    <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginBottom: 8 }}>{f.label}</div>
                    <input className="fs-input fs-mono" defaultValue={f.value} style={{ fontSize: '0.875rem' }} />
                  </div>
                ))}
                <div style={{ paddingTop: 16, borderTop: '1px solid var(--fs-border)', marginTop: 8 }}>
                  <button className="fs-btn fs-btn-primary fs-mono">COMMIT_CHANGES</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'team' && (
            <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--fs-border)', paddingBottom: 16, marginBottom: 32 }}>
                <div className="fs-label" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Network size={14} color="var(--fs-text-2)" />
                  ACCESS CONTROL LIST
                </div>
                <button className="fs-btn fs-btn-secondary fs-btn-sm fs-mono" style={{ fontSize: '0.6875rem' }}>PROVISION_USER</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--fs-border)' }}>
                {[
                  { name: 'ANALYST_A', email: 'analyst.a@sys', role: 'ADMIN', status: 'ONLINE' },
                  { name: 'REVIEWER_B', email: 'reviewer.b@sys', role: 'REVIEWER', status: 'OFFLINE' },
                  { name: 'APPROVER_C', email: 'approver.c@sys', role: 'AUDITOR', status: 'ONLINE' },
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', background: 'var(--fs-panel)', padding: '16px 20px', gap: 16 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.status === 'ONLINE' ? 'var(--fs-verified)' : 'var(--fs-text-3)' }} />
                    <div style={{ flex: 1 }}>
                      <div className="fs-mono" style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--fs-text-1)' }}>{m.name}</div>
                      <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginTop: 4 }}>{m.email}</div>
                    </div>
                    <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-2)', background: 'var(--fs-bg)', padding: '2px 6px', border: '1px solid var(--fs-border)' }}>{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '40px' }}>
              <div className="fs-label" style={{ marginBottom: 32, display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid var(--fs-border)', paddingBottom: 16 }}>
                <Terminal size={14} color="var(--fs-text-2)" />
                SYSTEM ALERT ROUTING
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { label: 'CASE_STATE_MUTATION', desc: 'Alert when investigation status is updated', enabled: true },
                  { label: 'BLOCKCHAIN_ANCHOR_SYNC', desc: 'Cryptographic confirmation from Polygon Mainnet', enabled: true },
                  { label: 'CRITICAL_TAMPER_DETECT', desc: 'Immediate priority alert on deepfake identification', enabled: true },
                  { label: 'RESOURCE_TELEMETRY', desc: 'Weekly data throughput and storage metrics', enabled: false },
                ].map((n, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 24, borderBottom: i === 3 ? 'none' : '1px solid var(--fs-border)' }}>
                    <div>
                      <div className="fs-mono" style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--fs-text-1)' }}>{n.label}</div>
                      <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)', marginTop: 8 }}>{n.desc}</div>
                    </div>
                    <div style={{
                      width: 44, height: 24,
                      background: n.enabled ? 'var(--fs-text-1)' : 'var(--fs-bg)',
                      border: '1px solid', borderColor: n.enabled ? 'var(--fs-text-1)' : 'var(--fs-border-strong)',
                      position: 'relative', cursor: 'pointer', flexShrink: 0
                    }}>
                      <div style={{
                        position: 'absolute', top: 2, left: n.enabled ? 22 : 2,
                        width: 18, height: 18, background: n.enabled ? 'var(--fs-text-inverse)' : 'var(--fs-text-3)',
                        transition: 'left var(--t-fast)'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: 'CRYPTOGRAPHIC_KEY_ROTATION', desc: 'Rotate account authentication keys.', action: 'ROTATE_KEYS' },
                { title: 'MULTI_FACTOR_AUTH', desc: 'MFA_STATUS: ACTIVE. Authenticated via hardware token.', action: 'CONFIGURE_MFA' },
                { title: 'SESSION_REGISTRY', desc: 'ACTIVE_SESSIONS: 2. LAST_SEEN: SECURE_TERMINAL_04.', action: 'TERMINATE_SESSIONS' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="fs-mono" style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--fs-text-1)', marginBottom: 8 }}>{s.title}</div>
                    <div className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>{s.desc}</div>
                  </div>
                  <button className="fs-btn fs-btn-secondary fs-btn-sm fs-mono" style={{ fontSize: '0.6875rem' }}>{s.action}</button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
