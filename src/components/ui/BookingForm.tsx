'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, Mail, Phone, User, CheckCircle2 } from 'lucide-react';

interface BookingFormProps {
  serviceId: number;
  serviceName: string;
  priceInfo: string;
}

interface FormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  end_date?: string;
  guests: number;
  special_requests: string;
}

export default function BookingForm({ serviceId, serviceName, priceInfo }: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          service_id: serviceId,
          service_name: serviceName,
        }),
      });

      if (!res.ok) throw new Error('Booking failed');
      const result = await res.json();
      setReference(result.reference);
      setSubmitted(true);
      toast.success('Booking submitted successfully!');
    } catch {
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-[#C9A84C]" />
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-3">
          Booking Confirmed!
        </h3>
        <p className="text-white/60 mb-4">
          Your booking reference is:
        </p>
        <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl py-3 px-6 inline-block mb-4">
          <span className="text-[#C9A84C] font-bold text-xl tracking-widest">{reference}</span>
        </div>
        <p className="text-white/50 text-sm">
          We will contact you shortly to confirm your booking. Please save your reference number.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <h3 className="font-display text-2xl font-bold text-white mb-2">Book {serviceName}</h3>
      <p className="text-[#C9A84C] text-sm mb-6">{priceInfo}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
            <User size={14} className="text-[#C9A84C]" /> Full Name *
          </label>
          <input
            {...register('customer_name', { required: 'Name is required' })}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30"
            placeholder="Your full name"
          />
          {errors.customer_name && <p className="text-red-400 text-xs mt-1">{errors.customer_name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
              <Mail size={14} className="text-[#C9A84C]" /> Email *
            </label>
            <input
              {...register('customer_email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
              type="email"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30"
              placeholder="your@email.com"
            />
            {errors.customer_email && <p className="text-red-400 text-xs mt-1">{errors.customer_email.message}</p>}
          </div>
          <div>
            <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
              <Phone size={14} className="text-[#C9A84C]" /> Phone
            </label>
            <input
              {...register('customer_phone')}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30"
              placeholder="+254..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
              <Calendar size={14} className="text-[#C9A84C]" /> Date *
            </label>
            <input
              {...register('booking_date', { required: 'Date is required' })}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            />
            {errors.booking_date && <p className="text-red-400 text-xs mt-1">{errors.booking_date.message}</p>}
          </div>
          <div>
            <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
              <Clock size={14} className="text-[#C9A84C]" /> Time
            </label>
            <input
              {...register('booking_time')}
              type="time"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
        </div>

        <div>
          <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
            <Users size={14} className="text-[#C9A84C]" /> Number of Guests
          </label>
          <select
            {...register('guests')}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
            ))}
            <option value={15}>10–15 Guests</option>
            <option value={25}>15–25 Guests</option>
            <option value={50}>25–50 Guests</option>
            <option value={100}>50–100 Guests</option>
            <option value={200}>100–200 Guests</option>
          </select>
        </div>

        <div>
          <label className="text-white/70 text-sm mb-2 block">Special Requests</label>
          <textarea
            {...register('special_requests')}
            rows={3}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30 resize-none"
            placeholder="Any dietary requirements, accessibility needs, or special requests..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-gold py-4 rounded-xl text-sm font-semibold tracking-wide uppercase disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : `Book ${serviceName}`}
        </button>
      </form>
    </div>
  );
}
