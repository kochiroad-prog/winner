'use client';
import { use, useState } from 'react';
import { useArticleSession } from '@/hooks/useArticleSession';
import ApprovalUI from '@/components/approval/ApprovalUI';
import RevisionForm from '@/components/revision/RevisionForm';
import LinkReviewInterface from '@/components/revision/LinkReviewInterface';

const TABS = ['Overview','Approval','Links','Revisi'];

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function SessionDetailPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const { session, draft, progress } = useArticleSession(sessionId);
  const [activeTab, setActiveTab] = useState('Overview');

  if (!session) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', flexDirection:'column', gap:'16px' }}>
      <div style={{ fontSize:'32px' }}>⏳</div>
      <p style={{ color:'#64748b' }}>Memuat sesi...</p>
    </div>
  );

  const s = session.session || session;

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'40px 24px' }}>
      <div style={{ marginBottom:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
          <a href="/dashboard" style={{ color:'#475569', textDecoration:'none', fontSize:'14px' }}>← Dashboard</a>
          <span style={{ color:'#334155' }}>/</span>
          <span style={{ color:'#64748b', fontSize:'14px' }}>Sesi Detail</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <h1 style={{ fontSize:'24px', fontWeight:'800', color:'#f1f5f9', marginBottom:'8px' }}>{s.topic}</h1>
            <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
              <StatusBadge status={s.status} />
              <span style={{ color:'#475569', fontSize:'13px' }}>Cycle #{s.cycle_number}</span>
              <span style={{ color:'#334155', fontSize:'13px' }}>ID: {s.id?.slice(0,8)}...</span>
            </div>
          </div>
        </div>
      </div>

      {progress && (
        <div className="card" style={{ marginBottom:'24px', padding:'16px 20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
            <span style={{ fontSize:'13px', fontWeight:'600', color:'#94a3b8' }}>Workflow Progress</span>
            <span style={{ fontSize:'13px', color:'#64748b' }}>{progress.completed_steps?.length || 0}/{progress.total_steps || 5} steps</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width:`${((progress.completed_steps?.length||0)/(progress.total_steps||5))*100}%`, background:'linear-gradient(90deg,#6366f1,#8b5cf6)' }}/>
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap' }}>
        {TABS.map(tab => (
          <button key={tab} className={`tab ${activeTab===tab?'tab-active':'tab-inactive'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px', alignItems:'start' }}>
          <div className="card">
            {draft ? (
              <>
                <h2 style={{ fontSize:'20px', fontWeight:'700', marginBottom:'8px', color:'#f1f5f9' }}>{draft.title || 'Judul belum tersedia'}</h2>
                {draft.meta_description && <p style={{ color:'#64748b', fontSize:'14px', marginBottom:'16px', fontStyle:'italic' }}>{draft.meta_description}</p>}
                {draft.keywords?.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'20px' }}>
                    {draft.keywords.map((k: string, i: number) => (
                      <span key={i} style={{ background:'rgba(99,102,241,0.15)', color:'#818cf8', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500' }}>{k}</span>
                    ))}
                  </div>
                )}
                <div style={{ color:'#94a3b8', fontSize:'14px', lineHeight:'1.8', maxHeight:'400px', overflow:'auto', whiteSpace:'pre-wrap' }}>
                  {draft.content || 'Konten sedang diproses oleh AI agents...'}
                </div>
              </>
            ) : (
              <div style={{ textAlign:'center', padding:'40px' }}>
                <div style={{ fontSize:'48px', marginBottom:'16px' }}>🤖</div>
                <p style={{ color:'#475569' }}>AI agents sedang memproses artikel...</p>
              </div>
            )}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div className="card">
              <h3 style={{ fontWeight:'700', marginBottom:'16px', color:'#94a3b8', fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Metrik SEO</h3>
              <div style={{ marginBottom:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <span style={{ color:'#64748b', fontSize:'13px' }}>SEO Score</span>
                  <span style={{ color:'#818cf8', fontWeight:'700', fontSize:'14px' }}>{draft?.seo_score || '—'}{draft?.seo_score ? '/100' : ''}</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width:`${draft?.seo_score||0}%`, background:'linear-gradient(90deg,#6366f1,#8b5cf6)' }}/></div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ color:'#64748b', fontSize:'13px' }}>Word Count</span>
                <span style={{ color:'#818cf8', fontWeight:'700', fontSize:'14px' }}>{draft?.word_count || '—'}{draft?.word_count ? ' kata' : ''}</span>
              </div>
            </div>
            <div className="card">
              <h3 style={{ fontWeight:'700', marginBottom:'16px', color:'#94a3b8', fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Aksi Cepat</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                <button className="btn-primary" onClick={() => setActiveTab('Approval')} style={{ width:'100%', padding:'10px' }}>Lihat Approval →</button>
                <button className="btn-secondary" onClick={() => setActiveTab('Links')} style={{ width:'100%', padding:'10px' }}>Review Links</button>
                <button className="btn-secondary" onClick={() => setActiveTab('Revisi')} style={{ width:'100%', padding:'10px' }}>Request Revisi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Approval' && <ApprovalUI sessionId={sessionId} session={s} />}
      {activeTab === 'Links' && <LinkReviewInterface sessionId={sessionId} />}
      {activeTab === 'Revisi' && <RevisionForm sessionId={sessionId} />}
    </div>
  );
}