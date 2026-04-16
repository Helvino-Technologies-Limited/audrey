'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Filter } from 'lucide-react';

interface Booking {
  id: number;
  reference: string;
  service_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  special_requests: string;
  status: string;
  total_amount: number;
  notes: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  confirmed: 'text-green-400 bg-green-400/10 border-green-400/20',
  completed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => r.json())
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      if (selectedBooking?.id === id) setSelectedBooking(prev => prev ? { ...prev, status } : null);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Delete this booking?')) return;
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setBookings(prev => prev.filter(b => b.id !== id));
      setSelectedBooking(null);
      toast.success('Booking deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = bookings.filter(b => {
    const matchSearch = !search || b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-white mb-1">Bookings</h1>
        <p className="text-white/40 text-sm">Manage all service bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30"
            placeholder="Search by name, email or reference..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-white/30" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 glass-card rounded-xl shimmer" />)}
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-white/40 text-xs uppercase tracking-wide">Reference</th>
                  <th className="text-left px-6 py-4 text-white/40 text-xs uppercase tracking-wide">Customer</th>
                  <th className="text-left px-6 py-4 text-white/40 text-xs uppercase tracking-wide">Service</th>
                  <th className="text-left px-6 py-4 text-white/40 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-6 py-4 text-white/40 text-xs uppercase tracking-wide">Guests</th>
                  <th className="text-left px-6 py-4 text-white/40 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-4 text-white/40 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-white/30">No bookings found</td></tr>
                ) : filtered.map(booking => (
                  <tr key={booking.id} className="border-b border-white/5 hover:bg-white/2 cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                    <td className="px-6 py-4 text-[#C9A84C] text-sm font-mono">{booking.reference}</td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{booking.customer_name}</p>
                      <p className="text-white/40 text-xs">{booking.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-white/70 text-sm">{booking.service_name}</td>
                    <td className="px-6 py-4 text-white/70 text-sm">
                      {new Date(booking.booking_date).toLocaleDateString()}
                      {booking.booking_time && <span className="text-white/40 ml-1">{booking.booking_time}</span>}
                    </td>
                    <td className="px-6 py-4 text-white/70 text-sm">{booking.guests}</td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={e => { e.stopPropagation(); updateStatus(booking.id, e.target.value); }}
                        className={`px-2 py-1 rounded-full text-xs font-medium border capitalize bg-transparent ${statusColors[booking.status] || 'text-white/40 bg-white/5 border-white/10'}`}
                        onClick={e => e.stopPropagation()}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={e => { e.stopPropagation(); deleteBooking(booking.id); }} className="text-red-400/50 hover:text-red-400 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-2xl w-full max-w-lg p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <div className="space-y-4 text-sm">
              {[
                { l: 'Reference', v: selectedBooking.reference },
                { l: 'Customer', v: selectedBooking.customer_name },
                { l: 'Email', v: selectedBooking.customer_email },
                { l: 'Phone', v: selectedBooking.customer_phone || 'N/A' },
                { l: 'Service', v: selectedBooking.service_name },
                { l: 'Date', v: new Date(selectedBooking.booking_date).toLocaleDateString() },
                { l: 'Time', v: selectedBooking.booking_time || 'N/A' },
                { l: 'Guests', v: String(selectedBooking.guests) },
                { l: 'Special Requests', v: selectedBooking.special_requests || 'None' },
              ].map(({ l, v }) => (
                <div key={l} className="flex gap-4">
                  <span className="text-white/40 w-32 shrink-0">{l}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              {['confirmed', 'completed', 'cancelled'].map(s => (
                <button key={s} onClick={() => updateStatus(selectedBooking.id, s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    selectedBooking.status === s ? 'btn-gold' : 'border border-white/20 text-white/60 hover:border-[#C9A84C]/40'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
