'use client';
import { useState, useEffect } from 'react';
import { linkAPI } from '@/lib/api/article-client';

const MOCK_INTERNAL = [
  { id:'1', url:'/artikel/seo-guide', title:'Panduan SEO Lengkap', anchor_text:'panduan SEO', status:'valid' },
  { id:'2', url:'/artikel/content-marketing', title:'Content Marketing Strategy', anchor_text:'strategi konten', status:'valid' },
  { id:'3', url:'/artikel/broken-page', title:'Halaman Tidak Ditemukan', anchor_text:'baca lebih lanjut', status:'invalid' },
];
const MOCK_EXTERNAL = [
  { id:'4', url:'https://google.com', title:'Google', anchor_text:'Google Search', status:'valid', da_score:100 },
  { id:'5', url:'https://moz.com/learn/seo', title:'Moz SEO Guide', anchor_text:'panduan Moz', status:'valid', da_score:91 },
  { id:'6', url:'https://lowda-site.example.com', title:'Low DA Site', anchor_text:'referensi', status:'valid', da_score:12 },
];

function StatusDot({ status }: { status: string }) {
  const c = status==='valid'?'#10b981':status==='invalid'?'#ef4444':'#f59e0b';
  return <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:c, display:'inline-block', marginRight:'6px' }}/>;
}

export default function LinkReviewInterface({ sessionId }: { sessionId: string }) {
  const [activeTab, setActiveTab] = useState('internal');
  const [internal, setInternal] = useState(MOCK_INTERNAL);
  const [external, setExternal] = useState(MOCK_EXTERNAL);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const removeLink = (id: string, type: 'internal'|'external') => {
    if (type==='internal') setInternal(p => p.filter(l => l.id!==id));
    else setExternal(p => p.filter(l => l.id!==id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await linkAPI.save(sessionId, { internal_links: internal, external_links: external });
      setMsg('✅ Perubahan links berhasil disimpan!');
    } catch { setMsg('⚠️ Perubahan disimpan secara lokal (simpan ke server butuh approval ID)'); }
    setSaving(false);
  };

  const internValid = internal.filter(l => l.status==='valid').length;
  const externValid = external.filter(l => l.status==='valid').length;
  const avgDA = Math.round(external.reduce((s, l) => s + (l.da_score||0), 0) / external.length);

  return (
    <div>
      {msg && <div style={{ padding:'12px 16px', background:msg.includes('✅')?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)', border:`1px solid ${msg.includes('✅')?'rgba(16,185,129,0.3)':'rgba(245,158,11,0.3)'}`, borderRadius:'8px', marginBottom:'20px', color:msg.includes('✅')?'#34d399':'#f59e0b', fontSize:'14px' }}>{msg}</div>}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'24px' }}>
        {[
          { label:'Internal Links', val:internal.length, color:'#818cf8' },
          { label:'External Links', val:external.length, color:'#22d3ee' },
          { label:'Avg DA Score', val:`${avgDA}`, color:avgDA>=40?'#10b981':'#f59e0b' },
          { label:'Link Valid', val:`${internValid+externValid}/${internal.length+external.length}`, color:'#34d399' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign:'center', padding:'16px' }}>
            <div style={{ fontSize:'22px', fontWeight:'800', color:s.color, marginBottom:'4px' }}>{s.val}</div>
            <div style={{ color:'#475569', fontSize:'12px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sub Tabs */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
        {['internal','external','report'].map(t => (
          <button key={t} className={`tab ${activeTab===t?'tab-active':'tab-inactive'}`} onClick={() => setActiveTab(t)} style={{ textTransform:'capitalize' }}>{t==='internal'?'Internal Links':t==='external'?'External Links':'Laporan'}</button>
        ))}
      </div>

      {/* Internal links table */}
      {activeTab==='internal' && (
        <div className="card" style={{ padding:'0', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {['URL','Judul','Anchor Text','Status','Aksi'].map(h => <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'#475569', fontSize:'12px', fontWeight:'600', textTransform:'uppercase' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {internal.map(l => (
                <tr key={l.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding:'14px 16px', fontSize:'13px', color:'#818cf8', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.url}</td>
                  <td style={{ padding:'14px 16px', fontSize:'13px', color:'#94a3b8' }}>{l.title}</td>
                  <td style={{ padding:'14px 16px', fontSize:'13px', color:'#64748b', fontStyle:'italic' }}>{l.anchor_text}</td>
                  <td style={{ padding:'14px 16px' }}><StatusDot status={l.status}/><span style={{ fontSize:'12px', color:l.status==='valid'?'#34d399':'#f87171' }}>{l.status}</span></td>
                  <td style={{ padding:'14px 16px' }}>
                    <button onClick={() => removeLink(l.id,'internal')} style={{ padding:'4px 10px', fontSize:'12px', background:'rgba(239,68,68,0.1)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'4px', cursor:'pointer' }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* External links table */}
      {activeTab==='external' && (
        <div className="card" style={{ padding:'0', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {['URL','DA Score','Status','Aksi'].map(h => <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'#475569', fontSize:'12px', fontWeight:'600', textTransform:'uppercase' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {external.map(l => (
                <tr key={l.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding:'14px 16px', fontSize:'13px', color:'#818cf8', maxWidth:'250px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.url}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ padding:'4px 10px', borderRadius:'20px', fontSize:'13px', fontWeight:'700', background:(l.da_score||0)>=40?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)', color:(l.da_score||0)>=40?'#34d399':'#f87171' }}>DA {l.da_score}</span>
                  </td>
                  <td style={{ padding:'14px 16px' }}><StatusDot status={l.status}/><span style={{ fontSize:'12px', color:'#94a3b8' }}>{l.status}</span></td>
                  <td style={{ padding:'14px 16px' }}>
                    <button onClick={() => removeLink(l.id,'external')} style={{ padding:'4px 10px', fontSize:'12px', background:'rgba(239,68,68,0.1)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'4px', cursor:'pointer' }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report */}
      {activeTab==='report' && (
        <div className="card">
          <h3 style={{ fontWeight:'700', marginBottom:'16px', color:'#f1f5f9' }}>Laporan Kualitas Links</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {[
              { icon:'✅', label:`${internValid}/${internal.length} internal links valid`, color:'#34d399', ok:internValid===internal.length },
              { icon: avgDA>=40?'✅':'⚠️', label:`Rata-rata DA score: ${avgDA} (${avgDA>=40?'Baik':'Perlu peningkatan'})`, color:avgDA>=40?'#34d399':'#f59e0b', ok:avgDA>=40 },
              { icon:external.filter(l=>l.da_score&&l.da_score<20).length>0?'❌':'✅', label:`${external.filter(l=>l.da_score&&l.da_score<20).length} external links dengan DA sangat rendah (<20)`, color:external.filter(l=>l.da_score&&l.da_score<20).length>0?'#f87171':'#34d399', ok:external.filter(l=>l.da_score&&l.da_score<20).length===0 },
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', borderRadius:'8px', background:item.ok?'rgba(16,185,129,0.05)':'rgba(245,158,11,0.05)', border:`1px solid ${item.ok?'rgba(16,185,129,0.2)':'rgba(245,158,11,0.2)'}` }}>
                <span style={{ fontSize:'18px' }}>{item.icon}</span>
                <span style={{ color:item.color, fontSize:'14px' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop:'20px', textAlign:'right' }}>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving?'⏳ Menyimpan...':'💾 Simpan Perubahan'}</button>
      </div>
    </div>
  );
}
