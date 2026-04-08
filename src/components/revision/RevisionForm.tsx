'use client';
import { useState } from 'react';
import { revisionAPI } from '@/lib/api/article-client';

const AGENTS = [
  { key:'seo_analyzer', name:'SEO Analyzer', icon:'🔍', issues:['Keyword density terlalu rendah','Meta description terlalu pendek','H1 tidak mengandung keyword utama'] },
  { key:'content_writer', name:'Content Writer', icon:'✍️', issues:['Konten terlalu pendek','Paragraf tidak terstruktur','Butuh call-to-action yang lebih kuat'] },
  { key:'content_optimizer', name:'Content Optimizer', icon:'⚡', issues:['Readability score rendah','Kalimat terlalu panjang','Butuh lebih banyak bullet points'] },
  { key:'link_builder', name:'Link Builder', icon:'🔗', issues:['Ada broken links','DA score external links terlalu rendah','Kurang internal links'] },
  { key:'publisher', name:'Publisher', icon:'🚀', issues:['Format tidak sesuai platform','Featured image belum ada','Kategori belum dipilih'] },
];

export default function RevisionForm({ sessionId }: { sessionId: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const toggle = (key: string) => setSelected(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key]);
  const addIssue = (issue: string) => setFeedback(p => p ? `${p}\n- ${issue}` : `- ${issue}`);

  const handleSubmit = async () => {
    if (selected.length === 0) { setMsg('Pilih minimal 1 agent untuk direvisi'); return; }
    if (!feedback.trim()) { setMsg('Feedback wajib diisi'); return; }
    setSubmitting(true);
    try {
      await revisionAPI.request(sessionId, { agents_to_revise: selected, user_feedback: feedback });
      setMsg('✅ Permintaan revisi berhasil dikirim! Agents akan mulai bekerja ulang.');
      setSelected([]); setFeedback('');
    } catch { setMsg('❌ Gagal mengirim permintaan revisi'); }
    setSubmitting(false);
  };

  return (
    <div>
      {msg && <div style={{ padding:'12px 16px', background:msg.includes('✅')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', border:`1px solid ${msg.includes('✅')?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`, borderRadius:'8px', marginBottom:'20px', color:msg.includes('✅')?'#34d399':'#f87171', fontSize:'14px' }}>{msg}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', alignItems:'start' }}>
        {/* Agent Selection */}
        <div>
          <div className="card" style={{ marginBottom:'20px' }}>
            <h3 style={{ fontWeight:'700', marginBottom:'4px', color:'#f1f5f9' }}>Pilih Agent untuk Direvisi</h3>
            <p style={{ color:'#475569', fontSize:'13px', marginBottom:'16px' }}>Pilih agent yang perlu menjalankan ulang proses</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {AGENTS.map(agent => (
                <div key={agent.key} onClick={() => toggle(agent.key)}
                  style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'8px', border:`1px solid ${selected.includes(agent.key)?'rgba(99,102,241,0.4)':'rgba(255,255,255,0.06)'}`, background:selected.includes(agent.key)?'rgba(99,102,241,0.1)':'rgba(255,255,255,0.02)', cursor:'pointer', transition:'all 0.2s' }}>
                  <div style={{ width:'20px', height:'20px', borderRadius:'4px', border:`2px solid ${selected.includes(agent.key)?'#6366f1':'#334155'}`, background:selected.includes(agent.key)?'#6366f1':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'12px' }}>
                    {selected.includes(agent.key) && '✓'}
                  </div>
                  <span style={{ fontSize:'18px' }}>{agent.icon}</span>
                  <span style={{ fontWeight:'600', fontSize:'14px', color:'#f1f5f9' }}>{agent.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick issues */}
          {selected.length > 0 && (
            <div className="card">
              <h4 style={{ fontWeight:'700', marginBottom:'12px', color:'#94a3b8', fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Masalah Umum</h4>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                {AGENTS.filter(a => selected.includes(a.key)).flatMap(a => a.issues).map((issue, i) => (
                  <button key={i} onClick={() => addIssue(issue)} style={{ textAlign:'left', padding:'8px 12px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'6px', color:'#94a3b8', fontSize:'13px', cursor:'pointer', transition:'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(99,102,241,0.1)'; (e.currentTarget as HTMLElement).style.color='#818cf8'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.color='#94a3b8'; }}>
                    + {issue}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feedback & Submit */}
        <div>
          <div className="card" style={{ marginBottom:'16px' }}>
            <h3 style={{ fontWeight:'700', marginBottom:'4px', color:'#f1f5f9' }}>Feedback Revisi</h3>
            <p style={{ color:'#475569', fontSize:'13px', marginBottom:'16px' }}>Jelaskan secara detail apa yang perlu diperbaiki</p>
            <textarea className="input" placeholder="Contoh:&#10;- Keyword density terlalu rendah&#10;- Tambahkan lebih banyak data statistik&#10;- Perbaiki broken links di paragraf 3" value={feedback} onChange={e => setFeedback(e.target.value)} style={{ height:'200px', resize:'vertical', marginBottom:'16px' }}/>
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting || selected.length===0} style={{ width:'100%' }}>
              {submitting ? '⏳ Mengirim...' : `🔄 Request Revisi (${selected.length} agent dipilih)`}
            </button>
          </div>
          {/* Summary */}
          {selected.length > 0 && (
            <div className="card" style={{ background:'rgba(99,102,241,0.05)', borderColor:'rgba(99,102,241,0.2)' }}>
              <h4 style={{ fontWeight:'600', marginBottom:'10px', color:'#818cf8', fontSize:'13px' }}>Ringkasan Revisi</h4>
              <p style={{ color:'#64748b', fontSize:'13px', marginBottom:'8px' }}>{selected.length} agent akan re-run:</p>
              {selected.map(k => { const a = AGENTS.find(x => x.key===k)!; return <div key={k} style={{ color:'#94a3b8', fontSize:'13px', marginBottom:'4px' }}>{a.icon} {a.name}</div>; })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
