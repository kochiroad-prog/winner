'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { internalLinksAPI } from '@/lib/api/article-client';

export default function InternalLinksPage() {
  const [links, setLinks] = useState<{ id: string; url: string }[]>([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const data = await internalLinksAPI.list();
      setLinks(data.links || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    try {
      await internalLinksAPI.add(url);
      setUrl('');
      fetchLinks();
    } catch (e) {
      alert('Gagal menambahkan URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus link ini?')) return;
    try {
      await internalLinksAPI.remove(id);
      fetchLinks();
    } catch (e) {
      alert('Gagal menghapus link');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f1f5f9', marginBottom: '8px' }}>Pengaturan Artikel Internal</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Daftarkan URL artikel internal yang bisa direkomendasikan saat membuat artikel baru.</p>
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>URL Artikel</label>
            <input className="input" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://domain.com/artikel-terbaik" required disabled={loading} />
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ height: '42px', padding: '0 24px' }}>
            {loading ? '⏳' : '+ Tambah'}
          </button>
        </form>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontSize: '12px', fontWeight: '600' }}>URL TAUTAN</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', color: '#475569', fontSize: '12px', fontWeight: '600', width: '100px' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '16px', color: '#f1f5f9', fontSize: '14px', wordBreak: 'break-all' }}>
                  <a href={link.url} target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'none' }}>{link.url}</a>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(link.id)} style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', cursor: 'pointer' }}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={2} style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>Belum ada artikel internal.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
