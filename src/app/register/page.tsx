'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { setAccessToken } from '@/lib/auth-token';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('62');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val.startsWith('62') && val.length >= 2) {
      setWhatsapp('62' + val.substring(2));
    } else if (val === '' || val === '6') {
      setWhatsapp('62'); // prevent deleting 62 entirely easily, or just let them but validate later
    } else {
      setWhatsapp(val);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let formattedWa = whatsapp;
    if (!formattedWa.startsWith('62')) {
       // if they managed to delete it and typed something else
       if (formattedWa.startsWith('0')) {
         formattedWa = '62' + formattedWa.substring(1);
       } else {
         formattedWa = '62' + formattedWa;
       }
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email: email.trim(), 
        password 
      });
      
      if (signUpError) throw signUpError;
      
      if (data.user) {
        // Insert into profiles
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: name.trim(),
          whatsapp_number: formattedWa,
          whatsapp_opt_in: true
        });

        if (profileError) {
          // If profile fails, we might have an orphaned user, but for now just log/throw
          console.error("Gagal menyimpan profil:", profileError);
        }

        const token = data.session?.access_token;
        if (token) {
          setAccessToken(token);
          router.push('/dashboard');
        } else {
          // Typically implies email confirmation required
          setError('Registrasi berhasil. Silakan cek email Anda atau login.');
          router.push('/login');
        }
      }
    } catch (e: any) {
      setError(e?.message || 'Gagal registrasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f1f5f9', marginBottom: '8px' }}>Registrasi</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
          Daftar untuk menggunakan Winner Article Agent.
        </p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Nama Lengkap</label>
            <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Budi Santoso" required disabled={loading} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@domain.com" required disabled={loading} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>No WhatsApp</label>
            <input className="input" type="text" value={whatsapp} onChange={handleWhatsappChange} placeholder="62812XXXX" required disabled={loading} />
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>Pastikan diawali dengan 62</span>
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} minLength={6} />
          </div>

          {error && <div style={{ color: '#f87171', fontSize: '13px' }}>{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '6px' }}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#94a3b8' }}>
            Sudah punya akun? <a href="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>Masuk di sini</a>
          </div>
        </form>
      </div>
    </div>
  );
}
