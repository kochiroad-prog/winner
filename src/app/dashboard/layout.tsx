'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth-token';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
    } else {
      setChecking(false);
    }
  }, [router]);

  if (!mounted || checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>
        Memeriksa sesi...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Optional: Add a Dashboard Sidebar here if needed in the future */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
