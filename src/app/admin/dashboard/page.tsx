'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BedDouble, ShoppingBag, Star, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Stats {
  bookings: { total: number; byStatus: { count: string; status: string }[] };
  orders: { total: number; byStatus: { count: string; status: string }[] };
  reviews: { approved: number; pending: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<{ id: number; reference: string; customer_name: string; service_name: string; booking_date: string; status: string }[]>([]);
  const [recentOrders, setRecentOrders] = useState<{ id: number; reference: string; customer_name: string; arrival_date: string; total_amount: number; status: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/orders').then(r => r.json()),
    ]).then(([statsData, bookings, orders]) => {
      setStats(statsData);
      setRecentBookings(bookings.slice(0, 5));
      setRecentOrders(orders.slice(0, 5));
    }).catch(() => {});
  }, []);

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-400 bg-yellow-400/10',
      confirmed: 'text-green-400 bg-green-400/10',
      completed: 'text-blue-400 bg-blue-400/10',
      cancelled: 'text-red-400 bg-red-400/10',
      preparing: 'text-orange-400 bg-orange-400/10',
      ready: 'text-green-400 bg-green-400/10',
    };
    return colors[status] || 'text-white/40 bg-white/5';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-white/40 text-sm">Welcome back — here's what's happening at The Audrey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
              <BedDouble size={18} className="text-[#C9A84C]" />
            </div>
            <span className="text-white/30 text-xs uppercase tracking-wide">Bookings</span>
          </div>
          <p className="text-white font-bold text-3xl">{stats?.bookings.total || 0}</p>
          <p className="text-white/40 text-xs mt-1">Total bookings</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
              <ShoppingBag size={18} className="text-[#C9A84C]" />
            </div>
            <span className="text-white/30 text-xs uppercase tracking-wide">Orders</span>
          </div>
          <p className="text-white font-bold text-3xl">{stats?.orders.total || 0}</p>
          <p className="text-white/40 text-xs mt-1">Food orders</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
              <Star size={18} className="text-[#C9A84C]" />
            </div>
            <span className="text-white/30 text-xs uppercase tracking-wide">Reviews</span>
          </div>
          <p className="text-white font-bold text-3xl">{stats?.reviews.approved || 0}</p>
          <p className="text-white/40 text-xs mt-1">Approved reviews</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
              <Clock size={18} className="text-yellow-400" />
            </div>
            <span className="text-white/30 text-xs uppercase tracking-wide">Pending</span>
          </div>
          <p className="text-white font-bold text-3xl">{stats?.reviews.pending || 0}</p>
          <p className="text-white/40 text-xs mt-1">Reviews awaiting approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-white font-semibold">Recent Bookings</h3>
            <Link href="/admin/dashboard/bookings" className="text-[#C9A84C] text-sm hover:underline">View all</Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-white/30 text-sm">No bookings yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentBookings.map(b => (
                <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{b.customer_name}</p>
                    <p className="text-white/40 text-xs">{b.service_name} · {new Date(b.booking_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`flex-none px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(b.status)}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-white font-semibold">Recent Food Orders</h3>
            <Link href="/admin/dashboard/orders" className="text-[#C9A84C] text-sm hover:underline">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-white/30 text-sm">No orders yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentOrders.map(o => (
                <div key={o.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{o.customer_name}</p>
                    <p className="text-white/40 text-xs">Arrives {new Date(o.arrival_date).toLocaleDateString()} · KES {Number(o.total_amount).toLocaleString()}</p>
                  </div>
                  <span className={`flex-none px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(o.status)}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Approve Reviews', href: '/admin/dashboard/reviews', icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Update Services', href: '/admin/dashboard/services', icon: AlertCircle, color: 'text-[#C9A84C]' },
          { label: 'Upload Media', href: '/admin/dashboard/media', icon: XCircle, color: 'text-blue-400' },
          { label: 'Site Settings', href: '/admin/dashboard/settings', icon: XCircle, color: 'text-purple-400' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="glass-card rounded-xl p-5 hover:border-[#C9A84C]/30 transition-all flex items-center gap-3">
            <item.icon size={18} className={item.color} />
            <span className="text-white/70 text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
