'use client'
import { User, Users, Bell, Shield, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [tab, setTab] = useState<'profile'|'team'|'notifications'|'security'>('profile')

  return (
    <div style={{ padding: '32px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Settings</h1>
        <p style={{ color: 'var(--fs-text-2)', fontSize: '0.875rem' }}>Manage your account, team, and preferences.</p>
      </div>

      <div className="fs-tabs" style={{ maxWidth: 440, marginBottom: 28 }}>
        {([
          { id: 'profile', icon: User, label: 'Profile' },
          { id: 'team', icon: Users, label: 'Team' },
          { id: 'notifications', icon: Bell, label: 'Notifications' },
          { id: 'security', icon: Shield, label: 'Security' },
        ] as const).map(t => (
          <button key={t.id} className={`fs-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="fs-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--fs-border)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--fs-elevated)', border: '2px solid var(--fs-border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.375rem', fontWeight: 700, color: 'var(--fs-accent-light)'
            }}>A</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Analyst A</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--fs-text-2)' }}>analyst@forensics.example.com</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <span className="fs-badge fs-badge-accent">Pro Plan</span>
                <span className="fs-badge fs-badge-neutral">Analyst Role</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { label: 'Full Name', value: 'Analyst A' },
              { label: 'Email Address', value: 'analyst@forensics.example.com' },
              { label: 'Organization', value: 'Forensics Group Ltd.' },
            ].map((f, i) => (
              <div key={i}>
                <div className="fs-label" style={{ marginBottom: 6 }}>{f.label}</div>
                <input className="fs-input" defaultValue={f.value} />
              </div>
            ))}
            <div style={{ paddingTop: 8 }}>
              <button className="fs-btn fs-btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'team' && (
        <div className="fs-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 600 }}>Team Members</h3>
            <button className="fs-btn fs-btn-primary fs-btn-sm">Invite Member</button>
          </div>
          {[
            { name: 'Analyst A', email: 'analyst.a@example.com', role: 'Analyst', status: 'active' },
            { name: 'Reviewer B', email: 'reviewer.b@example.com', role: 'Reviewer', status: 'active' },
            { name: 'Approver C', email: 'approver.c@example.com', role: 'Approver', status: 'active' },
          ].map((m, i) => (
            <div key={i} className="fs-data-row">
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--fs-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', color: 'var(--fs-accent-light)', flexShrink: 0 }}>
                {m.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{m.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)' }}>{m.email}</div>
              </div>
              <span className="fs-badge fs-badge-neutral">{m.role}</span>
              <span className="fs-badge fs-badge-verified">Active</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'notifications' && (
        <div className="fs-card" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 600, marginBottom: 20 }}>Notification Preferences</h3>
          {[
            { label: 'Case status changes', desc: 'Notified when a case is approved, rejected, or updated', enabled: true },
            { label: 'Blockchain anchor confirmations', desc: 'Notified when evidence is confirmed on Polygon', enabled: true },
            { label: 'Deepfake detection alerts', desc: 'Immediate alert when tampering is detected in a scan', enabled: true },
            { label: 'Weekly usage report', desc: 'Summary of scans, reports, and storage used', enabled: false },
          ].map((n, i) => (
            <div key={i} className="fs-data-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{n.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--fs-text-3)', marginTop: 2 }}>{n.desc}</div>
              </div>
              <div style={{
                width: 40, height: 22, borderRadius: 99,
                background: n.enabled ? 'var(--fs-accent)' : 'var(--fs-elevated)',
                border: '1px solid var(--fs-border-strong)',
                position: 'relative', cursor: 'pointer', flexShrink: 0
              }}>
                <div style={{
                  position: 'absolute', top: 3, left: n.enabled ? 20 : 3,
                  width: 14, height: 14, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.15s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { title: 'Change Password', desc: 'Update your password to keep your account secure.', action: 'Update Password' },
            { title: 'Two-Factor Authentication', desc: '2FA is enabled. Authenticated via authenticator app.', action: 'Manage 2FA' },
            { title: 'Active Sessions', desc: '2 active sessions. Last seen: Chrome on macOS.', action: 'Manage Sessions' },
          ].map((s, i) => (
            <div key={i} className="fs-card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--fs-text-2)' }}>{s.desc}</div>
              </div>
              <button className="fs-btn fs-btn-secondary fs-btn-sm">{s.action} <ChevronRight size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
