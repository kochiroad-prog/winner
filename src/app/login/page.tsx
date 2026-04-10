'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { setAccessToken } from '@/lib/auth-token';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      const token = data.session?.access_token;
      if (!token) throw new Error('Login berhasil, tetapi token tidak ditemukan.');
      setAccessToken(token);
      router.push('/dashboard');
    } catch (e: any) {
      setError(e?.message || 'Gagal login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f1f5f9', marginBottom: '8px' }}>Login</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
          Masuk menggunakan akun Supabase Auth yang dibuat oleh admin.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@domain.com" required disabled={loading} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} />
          </div>

          {error && <div style={{ color: '#f87171', fontSize: '13px' }}>{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '6px' }}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}

