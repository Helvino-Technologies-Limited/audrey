'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Clock, Star, ChevronDown } from 'lucide-react';

interface ContactFormData {
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

const inputCls =
  'w-full bg-[var(--bg-card-2)] border border-[var(--border-dim)] rounded-xl px-4 py-3 text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[rgba(var(--gold-rgb),0.5)]';

const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2';

const errorCls = 'mt-1 text-xs text-red-400';

export default function ContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<'contact' | 'review' | 'done'>('contact');
  const [selectedRating, setSelectedRating] = useState(5);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ContactFormData>({ defaultValues: { subject: 'general' } });

  const {
    register: regReview,
    handleSubmit: handleReview,
    formState: { isSubmitting: submittingReview, errors: reviewErrors },
  } = useForm<ReviewFormData>({ defaultValues: { service: 'general' } });

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const onSubmitContact = async (data: ContactFormData) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success("Message sent! We'll get back to you shortly.");
      reset();
    } else {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const onSubmitReview = async (data: ReviewFormData) => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, rating: selectedRating }),
    });
    if (res.ok) {
      setMode('done');
      toast.success('Review submitted! It will appear after admin approval.');
    } else {
      toast.error('Failed to submit review.');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Page header */}
      <div className="page-header">
        <p className="page-header-label">Reach Out</p>
        <h1 className="page-header-title">Contact Us</h1>
        <div className="divider-gold mx-auto mb-5" />
        <p className="page-header-body">
          We&apos;d love to hear from you — for reservations, enquiries, or just to say hello.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* ── Left: Contact info ── */}
          <div className="flex flex-col gap-5">

            <div className="card p-7">
              <h3 className="font-display text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Get In Touch
              </h3>
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: MapPin,
                    label: 'Location',
                    content: settings.contact_address || 'Segere, Osoro Road, PISOKO Centre, Siaya County, Kenya',
                  },
                  {
                    icon: Phone,
                    label: 'Phone',
                    content: settings.contact_phone || '(+254) 780 306086',
                    href: `tel:${settings.contact_phone || '+254780306086'}`,
                  },
                  {
                    icon: Mail,
                    label: 'Email',
                    content: settings.contact_email || 'info@theaudreyresort.org',
                    href: `mailto:${settings.contact_email || 'info@theaudreyresort.org'}`,
                  },
                  {
                    icon: Clock,
                    label: 'Hours',
                    content: settings.operating_hours || 'Daily: 6:30 AM – 11 PM',
                    sub: 'Bar until midnight on weekends',
                  },
                ].map(({ icon: Icon, label, content, href, sub }) => (
                  <div key={label} className="flex gap-4 items-start">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(var(--gold-rgb),0.10)', border: '1px solid rgba(var(--gold-rgb),0.20)' }}
                    >
                      <Icon size={15} style={{ color: 'var(--gold)' }} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                      {href ? (
                        <a href={href} className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                          {content}
                        </a>
                      ) : (
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{content}</p>
                      )}
                      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: 'var(--gold)' }}>
                Payment Methods
              </p>
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                M-PESA Till: <strong style={{ color: 'var(--text-primary)' }}>{settings.mpesa_till || '845 419'}</strong>
              </p>
              <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Visa &amp; Mastercard accepted</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Cashless payments only</p>
            </div>

            <button
              onClick={() => setMode(mode === 'review' ? 'contact' : 'review')}
              className="card p-5 text-left transition-all hover:border-[rgba(var(--gold-rgb),0.4)] group"
              style={{ background: mode === 'review' ? 'rgba(var(--gold-rgb),0.05)' : undefined }}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <Star size={18} style={{ color: 'var(--gold)' }} />
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {mode === 'review' ? '← Back to contact form' : 'Leave a Review'}
                </span>
              </div>
              {mode !== 'review' && (
                <p className="text-xs" style={{ color: 'var(--text-muted)', paddingLeft: '2.15rem' }}>
                  Share your experience with other guests
                </p>
              )}
            </button>
          </div>

          {/* ── Right: Form panel ── */}
          <div className="lg:col-span-2">

            {/* Success state after review */}
            {mode === 'done' && (
              <div className="card p-16 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(var(--gold-rgb),0.12)', border: '1px solid rgba(var(--gold-rgb),0.3)' }}
                >
                  <Star size={28} style={{ color: 'var(--gold)' }} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Thank You!
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Your review has been submitted and is pending approval. We appreciate your feedback!
                </p>
                <button
                  onClick={() => setMode('contact')}
                  className="btn-outline px-6 py-2.5 rounded-full text-xs"
                >
                  Send a message instead
                </button>
              </div>
            )}

            {/* Contact form */}
            {mode === 'contact' && (
              <div className="card p-8">
                <h3 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Send a Message
                </h3>
                <p className="text-sm mb-7" style={{ color: 'var(--text-muted)' }}>
                  Fill in the form below and we&apos;ll respond as soon as possible.
                </p>

                <form onSubmit={handleSubmit(onSubmitContact)} noValidate className="flex flex-col gap-5">

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Full Name <span style={{ color: 'var(--gold)' }}>*</span></label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        className={inputCls}
                        placeholder="Your full name"
                        style={errors.name ? { borderColor: 'rgba(248,113,113,0.6)' } : {}}
                      />
                      {errors.name && <p className={errorCls}>{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Email Address <span style={{ color: 'var(--gold)' }}>*</span></label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                        })}
                        type="email"
                        className={inputCls}
                        placeholder="you@example.com"
                        style={errors.email ? { borderColor: 'rgba(248,113,113,0.6)' } : {}}
                      />
                      {errors.email && <p className={errorCls}>{errors.email.message}</p>}
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input
                        {...register('phone')}
                        className={inputCls}
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Subject</label>
                      <div className="relative">
                        <select {...register('subject')} className={inputCls} style={{ paddingRight: '2.5rem' }}>
                          <option value="general">General Enquiry</option>
                          <option value="reservation">Table Reservation</option>
                          <option value="accommodation">Accommodation Booking</option>
                          <option value="events">Events &amp; Weddings</option>
                          <option value="golf">Golf Booking</option>
                          <option value="conference">Conference Hall</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ color: 'var(--text-muted)' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelCls}>Message <span style={{ color: 'var(--gold)' }}>*</span></label>
                    <textarea
                      {...register('message', { required: 'Please write a message' })}
                      rows={6}
                      className={inputCls}
                      placeholder="How can we help you?"
                      style={{
                        resize: 'none',
                        ...(errors.message ? { borderColor: 'rgba(248,113,113,0.6)' } : {}),
                      }}
                    />
                    {errors.message && <p className={errorCls}>{errors.message.message}</p>}
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-gold px-8 py-3.5 rounded-full text-xs disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending…' : 'Send Message'}
                    </button>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Fields marked <span style={{ color: 'var(--gold)' }}>*</span> are required
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* Review form */}
            {mode === 'review' && (
              <div className="card p-8">
                <h3 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Leave a Review
                </h3>
                <p className="text-sm mb-7" style={{ color: 'var(--text-muted)' }}>
                  Your review will be visible after admin approval.
                </p>

                <form onSubmit={handleReview(onSubmitReview)} noValidate className="flex flex-col gap-5">

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Your Name <span style={{ color: 'var(--gold)' }}>*</span></label>
                      <input
                        {...regReview('customer_name', { required: 'Name is required' })}
                        className={inputCls}
                        placeholder="Your name"
                        style={reviewErrors.customer_name ? { borderColor: 'rgba(248,113,113,0.6)' } : {}}
                      />
                      {reviewErrors.customer_name && <p className={errorCls}>{reviewErrors.customer_name.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Email <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>optional</span></label>
                      <input
                        {...regReview('customer_email')}
                        type="email"
                        className={inputCls}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Star rating */}
                  <div>
                    <label className={labelCls}>Rating <span style={{ color: 'var(--gold)' }}>*</span></label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setSelectedRating(n)}
                          className="w-11 h-11 rounded-xl text-sm font-bold transition-all"
                          style={
                            n <= selectedRating
                              ? { background: 'rgba(var(--gold-rgb),0.18)', border: '1.5px solid var(--gold)', color: 'var(--gold)' }
                              : { background: 'var(--bg-card-2)', border: '1px solid var(--border-dim)', color: 'var(--text-muted)' }
                          }
                        >
                          {n}★
                        </button>
                      ))}
                      <span className="ml-2 self-center text-sm" style={{ color: 'var(--text-muted)' }}>
                        {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][selectedRating]}
                      </span>
                    </div>
                  </div>

                  {/* Title + Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Review Title</label>
                      <input
                        {...regReview('title')}
                        className={inputCls}
                        placeholder="Summarise your experience"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Service Reviewed</label>
                      <div className="relative">
                        <select {...regReview('service')} className={inputCls} style={{ paddingRight: '2.5rem' }}>
                          <option value="general">General</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="accommodation">Accommodation</option>
                          <option value="golf">Golf Course</option>
                          <option value="pool">Swimming Pool</option>
                          <option value="conference">Conference Hall</option>
                          <option value="events">Events</option>
                        </select>
                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ color: 'var(--text-muted)' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Review body */}
                  <div>
                    <label className={labelCls}>Your Review <span style={{ color: 'var(--gold)' }}>*</span></label>
                    <textarea
                      {...regReview('body', { required: 'Please write your review' })}
                      rows={6}
                      className={inputCls}
                      placeholder="Share details about your experience…"
                      style={{
                        resize: 'none',
                        ...(reviewErrors.body ? { borderColor: 'rgba(248,113,113,0.6)' } : {}),
                      }}
                    />
                    {reviewErrors.body && <p className={errorCls}>{reviewErrors.body.message}</p>}
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn-gold px-8 py-3.5 rounded-full text-xs disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting…' : 'Submit Review'}
                    </button>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Fields marked <span style={{ color: 'var(--gold)' }}>*</span> are required
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
