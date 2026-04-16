'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  arrival_date: string;
  arrival_time: string;
  guests: number;
  items: OrderItem[];
  total_amount: number;
  special_requests: string;
  status: string;
  notes: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  preparing: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  ready: 'text-green-400 bg-green-400/10 border-green-400/20',
  completed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status } : null);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = orders.filter(o =>
    !search ||
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.reference.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-white mb-1">Food Orders</h1>
        <p className="text-white/40 text-sm">Manage pre-ordered meals and food requests</p>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30"
          placeholder="Search orders..." />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 glass-card rounded-xl shimmer" />)}</div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-white/30">No orders yet</div>
          ) : filtered.map(order => (
            <div key={order.id} onClick={() => setSelectedOrder(order)} className="glass-card rounded-2xl p-6 cursor-pointer hover:border-[#C9A84C]/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#C9A84C] font-mono text-sm">{order.reference}</span>
                    <select
                      value={order.status}
                      onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize bg-transparent ${statusColors[order.status] || 'text-white/40'}`}
                      onClick={e => e.stopPropagation()}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <p className="text-white font-semibold">{order.customer_name}</p>
                  <p className="text-white/40 text-xs mb-3">
                    Arriving: {new Date(order.arrival_date).toLocaleDateString()} at {order.arrival_time}
                    {order.guests > 1 && ` · ${order.guests} guests`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((item, i) => (
                      <span key={i} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/70">
                        {item.quantity}× {item.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[#C9A84C] font-bold text-lg">KES {Number(order.total_amount).toLocaleString()}</p>
                  <p className="text-white/30 text-xs mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-2xl w-full max-w-lg p-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Order {selectedOrder.reference}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <div className="space-y-4 text-sm mb-6">
              {[
                { l: 'Customer', v: selectedOrder.customer_name },
                { l: 'Phone', v: selectedOrder.customer_phone || 'N/A' },
                { l: 'Arrival', v: `${new Date(selectedOrder.arrival_date).toLocaleDateString()} at ${selectedOrder.arrival_time}` },
                { l: 'Guests', v: String(selectedOrder.guests) },
                { l: 'Special Requests', v: selectedOrder.special_requests || 'None' },
              ].map(({ l, v }) => (
                <div key={l} className="flex gap-4">
                  <span className="text-white/40 w-32 shrink-0">{l}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#252525] rounded-xl p-4 mb-6">
              <p className="text-white/40 text-xs uppercase tracking-wide mb-3">Order Items</p>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-white text-sm">{item.quantity}× {item.name}</span>
                  <span className="text-[#C9A84C] text-sm">KES {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 mt-1">
                <span className="text-white font-semibold">Total</span>
                <span className="text-[#C9A84C] font-bold">KES {Number(selectedOrder.total_amount).toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {['pending','preparing','ready','completed','cancelled'].map(s => (
                <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    selectedOrder.status === s ? 'btn-gold' : 'border border-white/20 text-white/50 hover:border-[#C9A84C]/40'
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
