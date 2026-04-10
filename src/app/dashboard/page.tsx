'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useArticleSessions } from '@/hooks/useArticleSession';
import { articleAPI } from '@/lib/api/article-client';
import { getAccessToken } from '@/lib/auth-token';

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function DashboardPage() {
  const { sessions, mutate, isLoading } = useArticleSessions();
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) router.push('/login');
  }, [router]);

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Arsipkan sesi ini?')) return;
    await articleAPI.archive(id);
    mutate();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9', marginBottom: '6px' }}>Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Kelola semua sesi artikel Anda</p>
        </div>
        <button className="btn-primary" onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✨ Artikel Baru
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total', val: sessions.length, color: '#818cf8' },
          { label: 'Pending', val: sessions.filter((s: any) => s.status === 'pending').length, color: '#f59e0b' },
          { label: 'Published', val: sessions.filter((s: any) => s.status === 'published').length, color: '#10b981' },
          { label: 'Review', val: sessions.filter((s: any) => s.status === 'review').length, color: '#a78bfa' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, marginBottom: '4px' }}>{s.val}</div>
            <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontWeight: '700', fontSize: '16px' }}>Semua Sesi</h2>
          <button className="btn-secondary" onClick={() => mutate()} style={{ padding: '6px 14px', fontSize: '13px' }}>↻ Refresh</button>
        </div>
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>⏳ Memuat sesi...</div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <p style={{ color: '#475569', marginBottom: '20px' }}>Belum ada sesi artikel</p>
            <button className="btn-primary" onClick={() => router.push('/')}>Buat Artikel Pertama</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Topik', 'Status', 'Cycle', 'Dibuat', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s: any) => (
                  <tr key={s.id} onClick={() => router.push(`/dashboard/${s.id}`)}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <td style={{ padding: '16px', maxWidth: '300px' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.topic}</div>
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>ID: {s.id.slice(0, 8)}...</div>
                    </td>
                    <td style={{ padding: '16px' }}><StatusBadge status={s.status} /></td>
                    <td style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>#{s.cycle_number}</td>
                    <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>{formatDate(s.created_at)}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" onClick={e => { e.stopPropagation(); router.push(`/dashboard/${s.id}`); }} style={{ padding: '6px 12px', fontSize: '12px' }}>Buka →</button>
                        <button onClick={e => handleArchive(s.id, e)} style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', cursor: 'pointer' }}>Arsip</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
