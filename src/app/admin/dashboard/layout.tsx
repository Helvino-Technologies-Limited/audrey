'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => {
        if (!r.ok) router.push('/admin/login');
        else setChecking(false);
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#C9A84C', fontSize: '0.875rem' }}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex' }}>
      <AdminSidebar />
      {/* Main content — on mobile: top padding for header + bottom for tab bar */}
      <main style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto' }}>
        <div className="admin-content-inner">
          {children}
        </div>
      </main>
      <style>{`
        .admin-content-inner {
          padding: 2rem 1.5rem 2rem;
          max-width: 1100px;
        }
        @media (max-width: 767px) {
          .admin-content-inner {
            padding: 4.5rem 1rem 6rem;
          }
        }
      `}</style>
    </div>
  );
}
