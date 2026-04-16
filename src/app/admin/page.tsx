'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => {
        if (r.ok) router.push('/admin/dashboard');
        else router.push('/admin/login');
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="text-[#C9A84C] animate-pulse">Loading...</div>
    </div>
  );
}
