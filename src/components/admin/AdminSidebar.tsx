'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Calendar, ShoppingBag, Star, Settings,
  Image as ImageIcon, UtensilsCrossed, Layers, Film, LogOut,
  CalendarDays, BedDouble, FileEdit, Menu, X, Globe
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',    href: '/admin/dashboard',              icon: LayoutDashboard },
  { label: 'Bookings',     href: '/admin/dashboard/bookings',     icon: BedDouble },
  { label: 'Orders',       href: '/admin/dashboard/orders',       icon: ShoppingBag },
  { label: 'Reviews',      href: '/admin/dashboard/reviews',      icon: Star },
  { label: 'Services',     href: '/admin/dashboard/services',     icon: Layers },
  { label: 'Menu',         href: '/admin/dashboard/menu',         icon: UtensilsCrossed },
  { label: 'Gallery',      href: '/admin/dashboard/gallery',      icon: ImageIcon },
  { label: 'Events',       href: '/admin/dashboard/events',       icon: CalendarDays },
  { label: 'Page Editor',  href: '/admin/dashboard/page-editor',  icon: FileEdit },
  { label: 'Media',        href: '/admin/dashboard/media',        icon: Film },
  { label: 'Settings',     href: '/admin/dashboard/settings',     icon: Settings },
];

// Bottom nav shows only the most-used 5
const bottomNav = [
  navItems[0], // Dashboard
  navItems[1], // Bookings
  navItems[2], // Orders
  navItems[4], // Services
  navItems[10], // Settings
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setUserName(d.user.name); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out');
    router.push('/admin/login');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside style={{
        width: '220px',
        minHeight: '100vh',
        background: '#111111',
        borderRight: '1px solid rgba(201,168,76,0.15)',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }} className="admin-sidebar-desktop">
        {/* Brand */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: '#C9A84C', fontWeight: 700, fontSize: '0.9375rem', margin: 0 }}>Audrey Admin</p>
          <p style={{ color: 'rgba(240,235,225,0.35)', fontSize: '0.75rem', margin: '2px 0 0' }}>{userName}</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.625rem 0.875rem', borderRadius: '0.625rem',
                marginBottom: '2px',
                background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                border: active ? '1px solid rgba(201,168,76,0.20)' : '1px solid transparent',
                color: active ? '#C9A84C' : 'rgba(240,235,225,0.50)',
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem',
            borderRadius: '0.625rem', color: 'rgba(240,235,225,0.40)', textDecoration: 'none',
            fontSize: '0.875rem', marginBottom: '2px',
          }}>
            <Globe size={16} /> View Site
          </Link>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.625rem 0.875rem', borderRadius: '0.625rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(240,235,225,0.40)', fontSize: '0.875rem', textAlign: 'left',
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ─── Mobile: Top header bar ─── */}
      <div className="admin-mobile-header" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: '#111111', borderBottom: '1px solid rgba(201,168,76,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1rem', height: '56px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setDrawerOpen(true)} style={{
            background: 'none', border: 'none', color: '#C9A84C', cursor: 'pointer', padding: '6px',
          }}>
            <Menu size={22} />
          </button>
          <p style={{ color: '#C9A84C', fontWeight: 700, fontSize: '1rem', margin: 0 }}>Audrey Admin</p>
        </div>
        <Link href="/" style={{ color: 'rgba(240,235,225,0.45)', fontSize: '0.8rem', textDecoration: 'none' }}>
          View Site
        </Link>
      </div>

      {/* ─── Mobile: Slide-out drawer ─── */}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          {/* Backdrop */}
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} />
          {/* Drawer */}
          <div style={{
            position: 'relative', width: '280px', maxWidth: '80vw',
            background: '#111111', height: '100%', display: 'flex', flexDirection: 'column',
            borderRight: '1px solid rgba(201,168,76,0.15)',
          }}>
            {/* Drawer header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p style={{ color: '#C9A84C', fontWeight: 700, fontSize: '1rem', margin: 0 }}>Audrey Admin</p>
                <p style={{ color: 'rgba(240,235,225,0.40)', fontSize: '0.8rem', margin: '2px 0 0' }}>{userName}</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.50)', cursor: 'pointer', padding: '6px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Drawer nav */}
            <nav style={{ flex: 1, padding: '0.75rem 0.75rem', overflowY: 'auto' }}>
              {navItems.map(item => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    padding: '0.875rem 1rem', borderRadius: '0.75rem', marginBottom: '4px',
                    background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                    border: active ? '1px solid rgba(201,168,76,0.20)' : '1px solid transparent',
                    color: active ? '#C9A84C' : 'rgba(240,235,225,0.65)',
                    textDecoration: 'none', fontSize: '0.9375rem', fontWeight: active ? 600 : 400,
                  }}>
                    <Icon size={18} style={{ flexShrink: 0 }} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer footer */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={handleLogout} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.875rem 1rem', borderRadius: '0.75rem',
                background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)',
                color: '#f87171', cursor: 'pointer', fontSize: '0.9375rem',
              }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mobile: Bottom tab bar ─── */}
      <div className="admin-bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#111111', borderTop: '1px solid rgba(201,168,76,0.15)',
        display: 'flex', alignItems: 'stretch',
      }}>
        {bottomNav.map(item => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '3px', padding: '0.5rem 0.25rem',
              color: active ? '#C9A84C' : 'rgba(240,235,225,0.40)',
              textDecoration: 'none', fontSize: '0.65rem', fontWeight: active ? 600 : 400,
              borderTop: active ? '2px solid #C9A84C' : '2px solid transparent',
            }}>
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Responsive rules */}
      <style>{`
        .admin-sidebar-desktop { display: flex; }
        .admin-mobile-header   { display: none; }
        .admin-bottom-nav      { display: none; }
        @media (max-width: 767px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-header   { display: flex !important; }
          .admin-bottom-nav      { display: flex !important; }
        }
      `}</style>
    </>
  );
}
