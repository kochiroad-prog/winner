'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { articleAPI } from '@/lib/api/article-client';

const features = [
  { icon: '🔍', title: 'SEO Analyzer', desc: 'Analisis keyword, meta tags, dan struktur konten secara otomatis' },
  { icon: '✍️', title: 'Content Writer', desc: 'Generate artikel berkualitas tinggi dengan AI multi-agent' },
  { icon: '⚡', title: 'Content Optimizer', desc: 'Optimasi readability, flow, dan engagement secara real-time' },
  { icon: '🔗', title: 'Link Builder', desc: 'Validasi dan rekomendasi internal/external links otomatis' },
  { icon: '✅', title: 'Approval Workflow', desc: 'Review confidence score per agent sebelum publish' },
  { icon: '🚀', title: 'Auto Publisher', desc: 'Publish langsung ke platform dengan satu klik' },
];

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await articleAPI.create(topic.trim());
      router.push(`/dashboard/${data.session?.id || data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal membuat artikel. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '0 24px' }}>
      {/* Hero */}
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '80px', paddingBottom: '60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '6px 16px', marginBottom: '32px' }}>
          <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
          <span style={{ fontSize: '13px', color: '#818cf8', fontWeight: '600' }}>Multi-Agent AI System</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px' }}>
          <span className="gradient-text">Winner</span><br />
          <span style={{ color: '#f1f5f9' }}>Article Agent</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.7', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
          Platform multi-agent untuk menghasilkan, mereview, dan mempublikasikan artikel SEO berkualitas tinggi secara otomatis dengan approval workflow.
        </p>
        <form onSubmit={handleCreate} style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input
              className="input"
              type="text"
              placeholder="Masukkan topik artikel... (contoh: Strategi SEO 2025)"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button className="btn-primary" type="submit" disabled={loading || !topic.trim()} style={{ whiteSpace: 'nowrap', padding: '12px 28px', fontSize: '15px' }}>
              {loading ? '⏳ Membuat...' : '✨ Buat Artikel'}
            </button>
          </div>
          {error && <p style={{ color: '#f87171', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
          <p style={{ color: '#475569', fontSize: '13px', textAlign: 'center' }}>5 AI agents akan bekerja secara paralel untuk menghasilkan artikel terbaik</p>
        </form>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', marginBottom: '40px', color: '#f1f5f9' }}>
          Fitur <span className="gradient-text">Unggulan</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', transition: 'transform 0.2s, border-color 0.2s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}>
              <div style={{ fontSize: '28px', lineHeight: '1' }}>{f.icon}</div>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px', color: '#f1f5f9' }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {[['5', 'AI Agents'], ['99%', 'Accuracy'], ['< 2 min', 'Per Article']].map(([val, label], i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div className="gradient-text" style={{ fontSize: '40px', fontWeight: '800', marginBottom: '8px' }}>{val}</div>
            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
