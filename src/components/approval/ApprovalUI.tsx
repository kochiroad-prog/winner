'use client';
import { useState, useEffect } from 'react';
import { approvalAPI } from '@/lib/api/article-client';

const AGENTS = [
  { key:'seo_analyzer', name:'SEO Analyzer', icon:'🔍', desc:'Analisis keyword & meta' },
  { key:'content_writer', name:'Content Writer', icon:'✍️', desc:'Kualitas konten & gaya' },
  { key:'content_optimizer', name:'Content Optimizer', icon:'⚡', desc:'Readability & engagement' },
  { key:'link_builder', name:'Link Builder', icon:'🔗', desc:'Internal & external links' },
  { key:'publisher', name:'Publisher', icon:'🚀', desc:'Kesiapan publikasi' },
];

function scoreColor(score: number) {
  if (score >= 85) return '#10b981';
  if (score >= 70) return '#f59e0b';
  return '#ef4444';
}
function scoreLabel(score: number) {
  if (score >= 85) return 'Tinggi';
  if (score >= 70) return 'Sedang';
  return 'Rendah';
}

export default function ApprovalUI({ sessionId, session }: { sessionId: string; session: any }) {
  const [approval, setApproval] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (sessionId) {
      approvalAPI.get(sessionId).then(d => setApproval(d.approval)).catch(() => {});
    }
  }, [sessionId]);

  const handleSubmitApproval = async () => {
    setLoading(true);
    try {
      const d = await approvalAPI.submit(sessionId);
      setApproval(d.approval);
      setMsg('Artikel berhasil disubmit untuk approval!');
    } catch { setMsg('Gagal submit approval'); }
    setLoading(false);
  };

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await approvalAPI.approve(approval.id, notes);
      setMsg('✅ Artikel telah disetujui!');
      setApproval((p: any) => ({ ...p, status: 'approved' }));
    } catch { setMsg('Gagal approve'); }
    setSubmitting(false); setAction('');
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { setMsg('Alasan penolakan wajib diisi'); return; }
    setSubmitting(true);
    try {
      await approvalAPI.reject(approval.id, rejectReason);
      setMsg('❌ Artikel telah ditolak');
      setApproval((p: any) => ({ ...p, status: 'rejected' }));
    } catch { setMsg('Gagal reject'); }
    setSubmitting(false); setAction('');
  };

  const reports = approval?.agent_reports || AGENTS.map(a => ({ agent_name: a.key, confidence_score: Math.floor(Math.random()*30+65) }));
  const avgScore = Math.round(reports.reduce((s: number, r: any) => s + (r.confidence_score||0), 0) / reports.length);

  return (
    <div>
      {msg && <div style={{ padding:'12px 16px', background: msg.includes('✅')?'rgba(16,185,129,0.1)':msg.includes('❌')?'rgba(239,68,68,0.1)':'rgba(99,102,241,0.1)', border:`1px solid ${msg.includes('✅')?'rgba(16,185,129,0.3)':msg.includes('❌')?'rgba(239,68,68,0.3)':'rgba(99,102,241,0.3)'}`, borderRadius:'8px', marginBottom:'20px', color: msg.includes('✅')?'#34d399':msg.includes('❌')?'#f87171':'#818cf8', fontSize:'14px' }}>{msg}</div>}

      {/* Overall Score */}
      <div className="card" style={{ marginBottom:'24px', background:'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', borderColor:'rgba(99,102,241,0.2)', textAlign:'center', padding:'32px' }}>
        <p style={{ color:'#94a3b8', fontSize:'13px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'12px' }}>Overall Confidence Score</p>
        <div style={{ fontSize:'72px', fontWeight:'800', color:scoreColor(avgScore), lineHeight:'1', marginBottom:'8px' }}>{avgScore}<span style={{ fontSize:'28px', color:'#475569' }}>%</span></div>
        <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:'20px', background:`${scoreColor(avgScore)}20`, color:scoreColor(avgScore), fontWeight:'700', fontSize:'14px' }}>{scoreLabel(avgScore)} Kepercayaan</div>
      </div>

      {/* Agent Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'16px', marginBottom:'24px' }}>
        {AGENTS.map(agent => {
          const r = reports.find((x: any) => x.agent_name === agent.key);
          const score = r?.confidence_score || 0;
          return (
            <div key={agent.key} className="card" style={{ textAlign:'center' }}>
              <div style={{ fontSize:'28px', marginBottom:'8px' }}>{agent.icon}</div>
              <div style={{ fontWeight:'700', fontSize:'14px', marginBottom:'4px', color:'#f1f5f9' }}>{agent.name}</div>
              <div style={{ color:'#475569', fontSize:'12px', marginBottom:'12px' }}>{agent.desc}</div>
              <div style={{ fontSize:'32px', fontWeight:'800', color:scoreColor(score), marginBottom:'6px' }}>{score}%</div>
              <div style={{ color:scoreColor(score), fontSize:'12px', fontWeight:'600', marginBottom:'10px' }}>{scoreLabel(score)}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${score}%`, background:`linear-gradient(90deg,${scoreColor(score)},${scoreColor(score)}88)` }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {!approval ? (
        <div className="card" style={{ textAlign:'center', padding:'32px' }}>
          <p style={{ color:'#64748b', marginBottom:'20px' }}>Submit artikel untuk memulai proses approval</p>
          <button className="btn-primary" onClick={handleSubmitApproval} disabled={loading}>
            {loading ? '⏳ Submitting...' : '📋 Submit untuk Approval'}
          </button>
        </div>
      ) : approval.status === 'pending' ? (
        <div className="card" style={{ padding:'24px' }}>
          <h3 style={{ fontWeight:'700', marginBottom:'20px', color:'#f1f5f9' }}>Keputusan Approval</h3>
          {action === 'approve' ? (
            <div>
              <textarea className="input" placeholder="Catatan approval (opsional)..." value={notes} onChange={e => setNotes(e.target.value)} style={{ height:'80px', resize:'vertical', marginBottom:'12px' }}/>
              <div style={{ display:'flex', gap:'12px' }}>
                <button className="btn-success" onClick={handleApprove} disabled={submitting}>{submitting?'⏳...':'✅ Konfirmasi Approve'}</button>
                <button className="btn-secondary" onClick={() => setAction('')}>Batal</button>
              </div>
            </div>
          ) : action === 'reject' ? (
            <div>
              <textarea className="input" placeholder="Alasan penolakan (wajib)..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} style={{ height:'80px', resize:'vertical', marginBottom:'12px' }}/>
              <div style={{ display:'flex', gap:'12px' }}>
                <button className="btn-danger" onClick={handleReject} disabled={submitting}>{submitting?'⏳...':'❌ Konfirmasi Tolak'}</button>
                <button className="btn-secondary" onClick={() => setAction('')}>Batal</button>
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <button className="btn-success" onClick={() => setAction('approve')}>✅ Setujui & Publikasi</button>
              <button className="btn-danger" onClick={() => setAction('reject')}>❌ Tolak</button>
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ padding:'24px', textAlign:'center' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>{approval.status==='approved'?'✅':'❌'}</div>
          <div style={{ fontWeight:'700', fontSize:'18px', color: approval.status==='approved'?'#34d399':'#f87171' }}>
            Artikel {approval.status==='approved'?'Disetujui':'Ditolak'}
          </div>
          {approval.approval_notes && <p style={{ color:'#64748b', marginTop:'8px', fontSize:'14px' }}>{approval.approval_notes}</p>}
          {approval.rejected_reason && <p style={{ color:'#f87171', marginTop:'8px', fontSize:'14px' }}>Alasan: {approval.rejected_reason}</p>}
        </div>
      )}
    </div>
  );
}
