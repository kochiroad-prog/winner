import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Winner | Article Agent - Multi-Agent SEO Publishing',
  description: 'Platform multi-agent untuk publikasi artikel SEO dengan approval workflow, link validation, dan revision system',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <nav style={{ background: 'rgba(7,13,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100, padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: 'white' }}>W</div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9' }}>Winner</span>
            <span style={{ fontSize: '12px', color: '#6366f1', background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>Article Agent</span>
          </a>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href="/" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Home</a>
            <a href="/dashboard" style={{ padding: '8px 16px', borderRadius: '8px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Dashboard</a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
