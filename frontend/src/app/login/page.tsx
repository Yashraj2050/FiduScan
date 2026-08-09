'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, UserRole } from '@/lib/auth-context';
import { Fingerprint, Terminal, Shield, Network } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password, role);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fillDemo = (demoRole: UserRole) => {
    if (demoRole === 'admin') {
      setEmail('admin@fiduscan.sys');
      setPassword('admin123');
      setRole('admin');
    } else {
      setEmail('analyst@fiduscan.sys');
      setPassword('user123');
      setRole('user');
    }
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--fs-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
    }}>
      
      {/* Grid Background Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(to right, var(--fs-border) 1px, transparent 1px),
          linear-gradient(to bottom, var(--fs-border) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{
            width: 32, height: 32, background: 'var(--fs-text-1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Fingerprint size={18} color="var(--fs-bg)" />
          </div>
          <span className="fs-h3">FiduScan</span>
        </Link>

        {/* Card */}
        <div style={{
          background: 'var(--fs-surface)',
          border: '1px solid var(--fs-border-strong)',
          padding: '40px',
        }}>

          {/* Header */}
          <div style={{ marginBottom: 32, borderBottom: '1px solid var(--fs-border)', paddingBottom: 24 }}>
            <div className="fs-label" style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Network size={12} color="var(--fs-text-2)" />
              IDENTITY_VERIFICATION
            </div>
            <h1 className="fs-h1" style={{ fontSize: '1.25rem' }}>Access Terminal</h1>
          </div>

          {/* Role Toggle */}
          <div style={{ marginBottom: 32 }}>
            <div className="fs-label" style={{ marginBottom: 12 }}>SELECT_CLEARANCE_LEVEL</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {(['user', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  id={`role-${r}`}
                  onClick={() => { setRole(r); setError(''); }}
                  className="fs-mono"
                  style={{
                    padding: '12px',
                    border: '1px solid',
                    borderColor: role === r ? 'var(--fs-text-1)' : 'var(--fs-border)',
                    background: role === r ? 'var(--fs-panel)' : 'var(--fs-bg)',
                    cursor: 'pointer',
                    fontSize: '0.6875rem',
                    color: role === r ? 'var(--fs-text-1)' : 'var(--fs-text-3)',
                    transition: 'all var(--t-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {r === 'admin' ? <Shield size={12} /> : <Terminal size={12} />}
                  {r === 'admin' ? 'ADMINISTRATOR' : 'INVESTIGATOR'}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div className="fs-label" style={{ marginBottom: 8 }}>OPERATIVE_CREDENTIAL</div>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="operative@fiduscan.sys"
                required
                autoComplete="email"
                className="fs-input fs-mono"
              />
            </div>

            <div>
              <div className="fs-label" style={{ marginBottom: 8 }}>SECURITY_PASSPHRASE</div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="fs-input fs-mono"
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'var(--fs-bg)',
                border: '1px solid var(--fs-tampered)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span className="fs-mono" style={{ color: 'var(--fs-tampered)', fontSize: '0.6875rem' }}>ERR</span>
                <span className="fs-mono" style={{ fontSize: '0.75rem', color: 'var(--fs-text-1)' }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="fs-btn fs-btn-primary fs-btn-lg fs-mono"
              style={{ width: '100%', marginTop: 8 }}
            >
              {isLoading ? 'VERIFYING_IDENTITY...' : 'INITIATE_SESSION'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px dashed var(--fs-border)' }}>
            <div className="fs-label" style={{ marginBottom: 16 }}>DEMO_ACCESS_VECTORS</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                id="demo-user"
                onClick={() => fillDemo('user')}
                className="fs-btn fs-btn-secondary fs-btn-sm fs-mono"
                style={{ flex: 1, fontSize: '0.6875rem', justifyContent: 'center' }}
              >
                LOAD_INVESTIGATOR
              </button>
              <button
                id="demo-admin"
                onClick={() => fillDemo('admin')}
                className="fs-btn fs-btn-secondary fs-btn-sm fs-mono"
                style={{ flex: 1, fontSize: '0.6875rem', justifyContent: 'center' }}
              >
                LOAD_ADMIN
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center', marginTop: 32,
          display: 'flex', justifyContent: 'space-between'
        }}>
          <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>SECURE_ENCLAVE_ACTIVE</span>
          <span className="fs-mono" style={{ fontSize: '0.6875rem', color: 'var(--fs-text-3)' }}>SYS.V.3.1.0</span>
        </div>
      </div>
    </div>
  );
}
