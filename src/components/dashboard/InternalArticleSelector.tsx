'use client';
import { useState, useEffect } from 'react';
import { internalLinksAPI, articleAPI } from '@/lib/api/article-client';

export default function InternalArticleSelector({ sessionId, initialSelected }: { sessionId: string; initialSelected: string[] }) {
  const [links, setLinks] = useState<{ id: string; url: string }[]>([]);
  const [selected, setSelected] = useState<string[]>(initialSelected || []);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const data = await internalLinksAPI.list();
      setLinks(data.links || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (url: string) => {
    setSelected(prev => prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await articleAPI.updateDraft(sessionId, { recommended_links: selected });
      alert('Pilihan artikel internal berhasil disimpan.');
    } catch (e) {
      alert('Gagal menyimpan pilihan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', color: '#64748b' }}>Memuat artikel internal...</div>;

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9' }}>Rekomendasi Artikel Internal</h3>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Pilih URL yang ingin Anda sisipkan ke dalam artikel ini sebelum di-publish.</p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '8px 16px', fontSize: '13px' }}>
          {saving ? 'Menyimpan...' : 'Simpan Pilihan'}
        </button>
      </div>

      {links.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '12px' }}>Belum ada link internal yang didaftarkan.</p>
          <a href="/dashboard/internal-links" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>Kelola Artikel Internal</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {links.map((link) => (
            <label key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <input 
                type="checkbox" 
                checked={selected.includes(link.url)} 
                onChange={() => handleToggle(link.url)}
                style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }}
              />
              <span style={{ color: '#f1f5f9', fontSize: '14px', wordBreak: 'break-all' }}>{link.url}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
