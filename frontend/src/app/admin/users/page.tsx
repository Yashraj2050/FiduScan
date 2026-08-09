'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AdminUsersPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) router.push('/dashboard');
  }, [isAdmin, isLoading, router]);

  if (!isAdmin) return null;

  const USERS = [
    { id: 'usr_001', name: 'Lead Investigator', email: 'investigator@fiduscan.io', role: 'user', status: 'active', lastLogin: '4m ago', cases: 7 },
    { id: 'usr_002', name: 'Senior Analyst', email: 'analyst@fiduscan.io', role: 'user', status: 'active', lastLogin: '1h ago', cases: 3 },
    { id: 'usr_003', name: 'Junior Analyst', email: 'junior@fiduscan.io', role: 'user', status: 'inactive', lastLogin: '3d ago', cases: 1 },
    { id: 'usr_004', name: 'System Admin', email: 'admin@fiduscan.io', role: 'admin', status: 'active', lastLogin: 'now', cases: 0 },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <ShieldAlert size={16} color="#EF4444" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EF4444' }}>
              Admin · User Management
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--fs-text-1)' }}>
            User Management
          </h1>
          <p style={{ color: 'var(--fs-text-2)', marginTop: 4, fontSize: '0.875rem' }}>
            Manage platform access, roles and investigator permissions.
          </p>
        </div>
        <button
          id="invite-user-btn"
          style={{
            padding: '10px 20px', background: '#2E6BFF', color: '#fff',
            border: 'none', borderRadius: 9, cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 600, letterSpacing: '-0.01em',
            boxShadow: '0 0 20px rgba(46,107,255,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(46,107,255,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 20px rgba(46,107,255,0.3)')}
          onClick={() => alert('Invite user modal would open here.')}
        >
          + Invite User
        </button>
      </div>

      <div className="fs-card">
        <table className="fs-table" role="table" aria-label="Platform users">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Cases</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: u.role === 'admin' ? 'rgba(239,68,68,0.12)' : 'rgba(46,107,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700,
                      color: u.role === 'admin' ? '#EF4444' : '#2E6BFF',
                    }}>
                      {u.name[0]}
                    </div>
                    <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--fs-text-1)' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fs-text-2)' }}>{u.email}</td>
                <td>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    padding: '3px 8px', borderRadius: 4,
                    background: u.role === 'admin' ? 'rgba(239,68,68,0.08)' : 'rgba(46,107,255,0.08)',
                    color: u.role === 'admin' ? '#EF4444' : '#2E6BFF',
                    border: `1px solid ${u.role === 'admin' ? 'rgba(239,68,68,0.2)' : 'rgba(46,107,255,0.2)'}`,
                  }}>
                    {u.role === 'admin' ? '⚙ Admin' : '🔍 Investigator'}
                  </span>
                </td>
                <td style={{ color: 'var(--fs-text-2)', fontSize: '0.875rem' }}>{u.cases}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: u.status === 'active' ? '#22C55E' : 'rgba(182,194,209,0.2)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--fs-text-2)', textTransform: 'capitalize' }}>{u.status}</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--fs-text-3)' }}>{u.lastLogin}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      style={{
                        padding: '4px 10px', fontSize: '0.75rem', border: '1px solid rgba(182,194,209,0.1)',
                        background: 'none', color: 'var(--fs-text-2)', borderRadius: 6, cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(46,107,255,0.4)'; e.currentTarget.style.color = '#2E6BFF' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(182,194,209,0.1)'; e.currentTarget.style.color = 'var(--fs-text-2)' }}
                      onClick={() => alert(`Edit user: ${u.name}`)}
                    >
                      Edit
                    </button>
                    {u.role !== 'admin' && (
                      <button
                        style={{
                          padding: '4px 10px', fontSize: '0.75rem', border: '1px solid rgba(239,68,68,0.15)',
                          background: 'none', color: 'rgba(239,68,68,0.6)', borderRadius: 6, cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#EF4444' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(239,68,68,0.6)' }}
                        onClick={() => alert(`Revoke access: ${u.name}`)}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
