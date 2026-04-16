'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, RefreshCcw } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string | null;
  event_time: string | null;
  image_url: string | null;
  is_recurring: boolean;
  recurrence_pattern: string | null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const defaultEvents = [
    {
      id: 0,
      title: 'Live Music Nights',
      description: 'Join us every Friday and Saturday evening for live music performances from local and international artists. Enjoy craft cocktails and great company.',
      event_date: null,
      event_time: '19:00',
      image_url: null,
      is_recurring: true,
      recurrence_pattern: 'Every Friday & Saturday',
    },
    {
      id: -1,
      title: 'Golf Tournament',
      description: 'Monthly golf tournaments open to all skill levels. Great prizes, friendly competition, and an unforgettable day on our championship greens.',
      event_date: null,
      event_time: '08:00',
      image_url: null,
      is_recurring: true,
      recurrence_pattern: 'Monthly',
    },
    {
      id: -2,
      title: 'Weekend BBQ & Pool Party',
      description: 'Every weekend, join us poolside for our famous BBQ featuring nyama choma, pork ribs, and grilled fish. Live DJ and refreshing cocktails.',
      event_date: null,
      event_time: '12:00',
      image_url: null,
      is_recurring: true,
      recurrence_pattern: 'Every Weekend',
    },
  ];

  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="pt-32 pb-16 bg-gradient-to-b from-[#1A1200]/50 to-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">Experiences</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">Events</h1>
          <div className="divider-gold mx-auto mb-5" />
          <p className="text-white/60 text-lg">From live music to golf tournaments — there's always something happening at The Audrey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-80 glass-card rounded-2xl shimmer" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((event) => (
              <div key={event.id} className="glass-card rounded-2xl overflow-hidden hover:border-[#C9A84C]/30 transition-all group">
                {event.image_url ? (
                  <div className="relative h-52 overflow-hidden">
                    <Image src={event.image_url} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
                  </div>
                ) : (
                  <div className="h-52 bg-gradient-to-br from-[#C9A84C]/10 to-[#0D0D0D] flex items-center justify-center">
                    <Calendar size={48} className="text-[#C9A84C]/30" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-[#C9A84C] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">{event.description}</p>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    {event.event_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#C9A84C]" />
                        {new Date(event.event_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                    {event.is_recurring && (
                      <span className="flex items-center gap-1.5 text-[#C9A84C]/70">
                        <RefreshCcw size={12} className="text-[#C9A84C]" />
                        {event.recurrence_pattern}
                      </span>
                    )}
                    {event.event_time && (
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-[#C9A84C]" />
                        {event.event_time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA for private events */}
        <div className="mt-20 glass-card rounded-3xl p-12 text-center border border-[#C9A84C]/20">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Planning a Private Event?
          </h2>
          <p className="text-white/60 text-base mb-8 max-w-xl mx-auto">
            From weddings to corporate retreats, our expert events team will make your vision a reality. Contact us for custom packages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services/events" className="btn-gold px-8 py-4 rounded-full text-sm font-semibold tracking-wide uppercase">
              Events & Weddings
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-full border border-[#C9A84C]/40 text-[#C9A84C] text-sm font-semibold tracking-wide uppercase hover:bg-[#C9A84C]/10 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
