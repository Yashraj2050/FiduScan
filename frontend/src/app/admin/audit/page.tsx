'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ClipboardList, Download } from 'lucide-react';

const LOGS = [
  { id: 'log_001', user: 'investigator@fiduscan.io', action: 'POST /api/v1/image', status: 200, ip: '192.168.1.42', time: '2025-06-13T01:04:48Z', hash: 'a3f8c2d9' },
  { id: 'log_002', user: 'admin@fiduscan.io',        action: 'GET /api/v1/audit/logs', status: 200, ip: '10.0.0.1',     time: '2025-06-13T01:04:12Z', hash: 'b9d1e3f7' },
  { id: 'log_003', user: 'investigator@fiduscan.io', action: 'POST /api/v1/evidence',  status: 201, ip: '192.168.1.42', time: '2025-06-13T01:03:55Z', hash: 'c4a7f2e8' },
  { id: 'log_004', user: 'analyst@fiduscan.io',      action: 'GET /api/v1/reports',    status: 200, ip: '172.16.0.5',   time: '2025-06-13T01:02:11Z', hash: 'd6b3e9a1' },
  { id: 'log_005', user: 'junior@fiduscan.io',       action: 'POST /api/v1/auth/login', status: 401, ip: '10.0.0.77',   time: '2025-06-13T00:58:33Z', hash: 'e2c8f4d7' },
  { id: 'log_006', user: 'investigator@fiduscan.io', action: 'DELETE /api/v1/cases',   status: 403, ip: '192.168.1.42', time: '2025-06-13T00:55:09Z', hash: 'f1b4a9c3' },
];

export default function AdminAuditPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) router.push('/dashboard');
  }, [isAdmin, isLoading, router]);

  if (!isAdmin) return null;

  const statusColor = (code: number) => {
    if (code < 300) return '#22C55E';
    if (code < 400) return '#EAB308';
    if (code < 500) return '#F97316';
    return '#EF4444';
  };

  return (
    <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <ClipboardList size={16} color="#EF4444" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EF4444' }}>
              Admin · Audit Logs
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--fs-text-1)' }}>
            Cryptographic Audit Ledger
          </h1>
          <p style={{ color: 'var(--fs-text-2)', marginTop: 4, fontSize: '0.875rem' }}>
            Immutable, hash-chained log of all platform activity.
          </p>
        </div>
        <button
          id="export-audit-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: 'rgba(46,107,255,0.1)',
            color: '#2E6BFF', border: '1px solid rgba(46,107,255,0.2)',
            borderRadius: 9, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(46,107,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(46,107,255,0.1)')}
          onClick={() => {
            const csv = ['ID,User,Action,Status,IP,Timestamp,Hash',
              ...LOGS.map(l => `${l.id},${l.user},${l.action},${l.status},${l.ip},${l.time},${l.hash}`)
            ].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'fiduscan_audit_logs.csv'; a.click();
          }}
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="fs-card">
        <table className="fs-table" role="table" aria-label="Audit logs">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>User</th>
              <th>Action</th>
              <th>Status</th>
              <th>IP Address</th>
              <th>Timestamp</th>
              <th>Hash</th>
            </tr>
          </thead>
          <tbody>
            {LOGS.map(log => (
              <tr key={log.id}>
                <td><span className="fs-mono" style={{ color: 'var(--fs-accent-light)' }}>{log.id}</span></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--fs-text-2)' }}>{log.user}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--fs-text-1)' }}>{log.action}</td>
                <td>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
                    color: statusColor(log.status),
                  }}>{log.status}</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--fs-text-3)' }}>{log.ip}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--fs-text-3)' }}>{log.time}</td>
                <td>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    color: '#22C55E',
                    background: 'rgba(34,197,94,0.06)',
                    padding: '2px 8px', borderRadius: 4,
                    border: '1px solid rgba(34,197,94,0.15)',
                  }}>{log.hash}…</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
