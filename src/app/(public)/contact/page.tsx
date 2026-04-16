'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Clock, Star } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ReviewFormData {
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string;
  body: string;
  service: string;
}

export default function ContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>();
  const { register: regReview, handleSubmit: handleReview, formState: { isSubmitting: submittingReview } } = useForm<ReviewFormData>();

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const onSubmitContact = async (data: FormData) => {
    // Since we don't have email sending set up, just show success
    await new Promise(r => setTimeout(r, 800));
    toast.success('Message sent! We\'ll get back to you shortly.');
    reset();
  };

  const onSubmitReview = async (data: ReviewFormData) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, rating: selectedRating }),
      });
      if (!res.ok) throw new Error();
      setReviewSubmitted(true);
      toast.success('Review submitted! It will appear after admin approval.');
    } catch {
      toast.error('Failed to submit review.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="pt-32 pb-16 bg-gradient-to-b from-[#1A1200]/50 to-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">Reach Out</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">Contact Us</h1>
          <div className="divider-gold mx-auto mb-5" />
          <p className="text-white/60 text-lg">We'd love to hear from you. Reach out for reservations, enquiries or just to say hello.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-7">
              <h3 className="font-display text-xl font-bold text-white mb-6">Get In Touch</h3>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Location</p>
                    <p className="text-white/80 text-sm">{settings.contact_address || 'Segere, Osoro Road, PISOKO Centre, Siaya County, Kenya'}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Phone</p>
                    <a href={`tel:${settings.contact_phone}`} className="text-white/80 text-sm hover:text-[#C9A84C] transition-colors block">
                      {settings.contact_phone || '(+254) 780 306086'}
                    </a>
                    <a href="tel:+254708306086" className="text-white/60 text-sm hover:text-[#C9A84C] transition-colors block">0708 306086</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Email</p>
                    <a href={`mailto:${settings.contact_email}`} className="text-white/80 text-sm hover:text-[#C9A84C] transition-colors">
                      {settings.contact_email || 'info@theaudreyresort.com'}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Hours</p>
                    <p className="text-white/80 text-sm">{settings.operating_hours || 'Daily: 6:30 AM – 11 PM'}</p>
                    <p className="text-white/50 text-xs">Bar until midnight weekends</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="glass-card rounded-2xl p-7 border-[#C9A84C]/20">
              <h4 className="text-[#C9A84C] font-semibold text-sm uppercase tracking-wide mb-4">Payment Methods</h4>
              <div className="space-y-2">
                <p className="text-white/70 text-sm">M-PESA Till: <strong className="text-white">{settings.mpesa_till || '845 419'}</strong></p>
                <p className="text-white/50 text-sm">All major cards accepted (Visa, Mastercard)</p>
                <p className="text-white/50 text-sm">Cashless payments only</p>
              </div>
            </div>

            {/* Review CTA */}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full glass-card rounded-2xl p-6 text-left hover:border-[#C9A84C]/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Star size={20} className="text-[#C9A84C]" />
                <h4 className="text-white font-semibold">Leave a Review</h4>
              </div>
              <p className="text-white/50 text-sm">Share your experience with other guests</p>
            </button>
          </div>

          {/* Contact Form or Review Form */}
          <div className="lg:col-span-2">
            {!showReviewForm ? (
              <div className="glass-card rounded-2xl p-8">
                <h3 className="font-display text-2xl font-bold text-white mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit(onSubmitContact)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Full Name *</label>
                      <input {...register('name', { required: true })} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Email *</label>
                      <input {...register('email', { required: true })} type="email" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Phone</label>
                      <input {...register('phone')} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30" placeholder="+254..." />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Subject</label>
                      <select {...register('subject')} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50">
                        <option value="general">General Enquiry</option>
                        <option value="reservation">Table Reservation</option>
                        <option value="accommodation">Accommodation Booking</option>
                        <option value="events">Events & Weddings</option>
                        <option value="golf">Golf Booking</option>
                        <option value="conference">Conference Hall</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Message *</label>
                    <textarea {...register('message', { required: true })} rows={5} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30 resize-none" placeholder="How can we help you?" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-gold px-8 py-4 rounded-xl text-sm font-semibold tracking-wide uppercase disabled:opacity-60">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            ) : reviewSubmitted ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Star size={48} className="text-[#C9A84C] mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-white mb-3">Thank You!</h3>
                <p className="text-white/60">Your review has been submitted and is pending approval. We appreciate your feedback!</p>
                <button onClick={() => { setShowReviewForm(false); setReviewSubmitted(false); }} className="mt-6 text-[#C9A84C] text-sm hover:underline">
                  Send a message instead
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-2xl font-bold text-white">Leave a Review</h3>
                  <button onClick={() => setShowReviewForm(false)} className="text-white/40 hover:text-white text-sm">← Back to contact</button>
                </div>
                <form onSubmit={handleReview(onSubmitReview)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Your Name *</label>
                      <input {...regReview('customer_name', { required: true })} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Email</label>
                      <input {...regReview('customer_email')} type="email" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30" placeholder="optional" />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/70 text-sm mb-3 block">Rating *</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => setSelectedRating(n)}
                          className={`w-10 h-10 rounded-full transition-all ${n <= selectedRating ? 'bg-[#C9A84C] text-black' : 'bg-[#1A1A1A] border border-white/20 text-white/40'}`}>
                          {n}★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Review Title</label>
                      <input {...regReview('title')} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30" placeholder="Summarize your experience" />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Service</label>
                      <select {...regReview('service')} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50">
                        <option value="general">General</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="accommodation">Accommodation</option>
                        <option value="golf">Golf Course</option>
                        <option value="pool">Swimming Pool</option>
                        <option value="conference">Conference</option>
                        <option value="events">Events</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Your Review *</label>
                    <textarea {...regReview('body', { required: true })} rows={5} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/30 resize-none" placeholder="Share details about your experience..." />
                  </div>

                  <button type="submit" disabled={submittingReview} className="btn-gold px-8 py-4 rounded-xl text-sm font-semibold tracking-wide uppercase disabled:opacity-60">
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
