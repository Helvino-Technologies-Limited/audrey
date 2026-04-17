'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Calendar, ShoppingBag, Star, Settings,
  Image as ImageIcon, UtensilsCrossed, Layers, Film, LogOut,
  ChevronLeft, ChevronRight, CalendarDays, BedDouble, FileEdit
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Bookings', href: '/admin/dashboard/bookings', icon: BedDouble },
  { label: 'Food Orders', href: '/admin/dashboard/orders', icon: ShoppingBag },
  { label: 'Reviews', href: '/admin/dashboard/reviews', icon: Star },
  { label: 'Services', href: '/admin/dashboard/services', icon: Layers },
  { label: 'Menu', href: '/admin/dashboard/menu', icon: UtensilsCrossed },
  { label: 'Gallery', href: '/admin/dashboard/gallery', icon: ImageIcon },
  { label: 'Events', href: '/admin/dashboard/events', icon: CalendarDays },
  { label: 'Page Editor', href: '/admin/dashboard/page-editor', icon: FileEdit },
  { label: 'Media Library', href: '/admin/dashboard/media', icon: Film },
  { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => { if (data.user) setUserName(data.user.name); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  return (
    <aside className={`admin-sidebar flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} min-h-screen sticky top-0 shrink-0`}>
      {/* Header */}
      <div className="p-4 border-b border-[#C9A84C]/10 flex items-center justify-between">
        {!collapsed && (
          <div>
            <p className="text-[#C9A84C] font-bold text-sm">Audrey Admin</p>
            <p className="text-white/40 text-xs">{userName}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all shrink-0 ml-auto"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all mb-1 ${
                isActive
                  ? 'bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#C9A84C]/10 space-y-2">
        <Link href="/" title={collapsed ? 'View Site' : undefined}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-[#C9A84C] hover:bg-white/5 transition-all">
          <Calendar size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm">View Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
