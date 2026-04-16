'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { ShoppingCart, Plus, Minus, Leaf, Trash2, Calendar, Clock, Users, User, Mail, Phone, CheckCircle2, X } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_vegetarian: boolean;
  is_available: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  items: MenuItem[];
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  arrival_date: string;
  arrival_time: string;
  guests: number;
  special_requests: string;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OrderFormData>();

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then((data: Category[]) => {
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { id: item.id, name: item.name, price: Number(item.price), quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c);
      }
      return prev.filter(c => c.id !== id);
    });
  }, []);

  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);
  const totalPrice = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  const onSubmitOrder = async (data: OrderFormData) => {
    if (cart.length === 0) {
      toast.error('Please add items to your cart first');
      return;
    }
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: cart,
          total_amount: totalPrice,
        }),
      });
      if (!res.ok) throw new Error('Order failed');
      const result = await res.json();
      setOrderRef(result.reference);
      setOrderSubmitted(true);
      toast.success('Order placed successfully!');
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  const activeItems = categories.find(c => c.id === activeCategory)?.items || [];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Page Header */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-[#1A1200]/50 to-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">Culinary Excellence</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">
            Restaurant & Menu
          </h1>
          <div className="divider-gold mx-auto mb-5" />
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Authentic Kenyan flavours crafted from farm-fresh ingredients. Order ahead and we'll have it ready when you arrive.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-10 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-none px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide uppercase transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#C9A84C] text-black'
                  : 'border border-white/20 text-white/60 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 glass-card rounded-2xl shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeItems.map((item: MenuItem) => (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden hover:border-[#C9A84C]/30 transition-all group">
                {item.image_url && (
                  <div className="relative h-44 overflow-hidden">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-base">{item.name}</h3>
                    {item.is_vegetarian && (
                      <span className="flex items-center gap-1 text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">
                        <Leaf size={10} /> V
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-white/50 text-sm mb-4 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[#C9A84C] font-bold text-lg">
                      KES {Number(item.price).toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.is_available}
                      className="flex items-center gap-2 btn-gold px-4 py-2 rounded-full text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus size={14} />
                      {item.is_available ? 'Add to Order' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 btn-gold px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 z-40 text-sm font-semibold"
        >
          <ShoppingCart size={18} />
          <span>{totalItems} items</span>
          <span className="bg-black/20 px-2 py-0.5 rounded-full">KES {totalPrice.toLocaleString()}</span>
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1A1A1A] p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white">Your Order</h3>
              <button onClick={() => setShowCart(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {!showOrderForm && !orderSubmitted && (
              <div className="p-6 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <p className="text-white/50 text-xs">KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#C9A84C]/50">
                        <Minus size={12} />
                      </button>
                      <span className="text-white w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, is_vegetarian: false, description: '', image_url: null, is_available: true })} className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#C9A84C]/50">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-red-400/60 hover:text-red-400 ml-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Total</span>
                    <span className="text-[#C9A84C]">KES {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full btn-gold py-3 rounded-xl text-sm font-semibold tracking-wide uppercase"
                >
                  Proceed to Order
                </button>
              </div>
            )}

            {showOrderForm && !orderSubmitted && (
              <form onSubmit={handleSubmit(onSubmitOrder)} className="p-6 space-y-4">
                <p className="text-white/60 text-sm mb-4">Tell us when you're arriving so we can start preparing your order!</p>

                <div>
                  <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                    <User size={13} className="text-[#C9A84C]" /> Full Name *
                  </label>
                  <input {...register('customer_name', { required: true })} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30" placeholder="Your name" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/70 text-sm mb-2 flex items-center gap-2"><Mail size={13} className="text-[#C9A84C]" /> Email</label>
                    <input {...register('customer_email')} type="email" className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30" placeholder="email@..." />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-2 flex items-center gap-2"><Phone size={13} className="text-[#C9A84C]" /> Phone</label>
                    <input {...register('customer_phone')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30" placeholder="+254..." />
                  </div>
                </div>

                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-4">
                  <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-wide mb-3">When will you arrive?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/60 text-xs mb-1 flex items-center gap-1"><Calendar size={11} /> Arrival Date *</label>
                      <input {...register('arrival_date', { required: true })} type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs mb-1 flex items-center gap-1"><Clock size={11} /> Arrival Time *</label>
                      <input {...register('arrival_time', { required: true })} type="time" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 flex items-center gap-2"><Users size={13} className="text-[#C9A84C]" /> Number of Guests</label>
                  <select {...register('guests')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Special Requests</label>
                  <textarea {...register('special_requests')} rows={2} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 resize-none placeholder-white/30" placeholder="Dietary requirements, allergies..." />
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white text-sm font-semibold mb-4">
                    <span>Order Total</span>
                    <span className="text-[#C9A84C]">KES {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowOrderForm(false)} className="flex-1 border border-white/20 py-3 rounded-xl text-white/60 text-sm">Back</button>
                    <button type="submit" disabled={isSubmitting} className="flex-2 btn-gold px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-60">
                      {isSubmitting ? 'Placing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {orderSubmitted && (
              <div className="p-8 text-center">
                <CheckCircle2 size={48} className="text-[#C9A84C] mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-white mb-3">Order Placed!</h3>
                <p className="text-white/60 text-sm mb-4">Your reference number:</p>
                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl py-3 px-6 inline-block mb-4">
                  <span className="text-[#C9A84C] font-bold text-lg tracking-widest">{orderRef}</span>
                </div>
                <p className="text-white/50 text-sm">We'll start preparing your food before you arrive. See you soon!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
