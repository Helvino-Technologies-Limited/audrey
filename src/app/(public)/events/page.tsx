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

const DEFAULT_EVENTS: Event[] = [
  { id: 0, title: 'Live Music Nights', description: 'Join us every Friday and Saturday evening for live music performances from local and international artists. Enjoy craft cocktails and great company.', event_date: null, event_time: '19:00', image_url: null, is_recurring: true, recurrence_pattern: 'Every Friday & Saturday' },
  { id: -1, title: 'Golf Tournament', description: 'Monthly golf tournaments open to all skill levels. Great prizes, friendly competition, and an unforgettable day on our championship greens.', event_date: null, event_time: '08:00', image_url: null, is_recurring: true, recurrence_pattern: 'Monthly' },
  { id: -2, title: 'Weekend BBQ & Pool Party', description: 'Every weekend, join us poolside for our famous BBQ featuring nyama choma, pork ribs, and grilled fish. Live DJ and refreshing cocktails.', event_date: null, event_time: '12:00', image_url: null, is_recurring: true, recurrence_pattern: 'Every Weekend' },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(DEFAULT_EVENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then((data: Event[]) => { if (Array.isArray(data) && data.length > 0) setEvents(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D' }}>
      {/* Header */}
      <div style={{ paddingTop: '8rem', paddingBottom: '4rem', background: 'linear-gradient(to bottom, rgba(26,18,0,0.55) 0%, transparent 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <p className="section-label">Experiences</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', fontWeight: 700, color: '#F0EBE1', marginBottom: '1.25rem' }}>Events</h1>
          <div className="divider-gold" style={{ margin: '0 auto 1.5rem' }} />
          <p style={{ color: 'rgba(240,235,225,0.60)', fontSize: '1.0625rem', lineHeight: 1.7 }}>
            From live music to golf tournaments — there's always something happening at The Audrey
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3].map(i => <div key={i} className="card shimmer" style={{ height: '320px' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {events.map(event => (
              <div key={event.id} className="card" style={{ overflow: 'hidden', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                {event.image_url ? (
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <Image src={event.image_url} alt={event.title} fill style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #161616 0%, transparent 60%)' }} />
                  </div>
                ) : (
                  <div style={{ height: '160px', background: 'linear-gradient(135deg, rgba(201,168,76,0.10) 0%, #111111 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={48} style={{ color: 'rgba(201,168,76,0.30)' }} />
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 className="font-display" style={{ color: '#F0EBE1', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    {event.title}
                  </h3>
                  <p style={{ color: 'rgba(240,235,225,0.60)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {event.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
                    {event.event_date && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(240,235,225,0.45)', fontSize: '0.8rem' }}>
                        <Calendar size={12} style={{ color: '#C9A84C' }} />
                        {new Date(event.event_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                    {event.is_recurring && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(201,168,76,0.75)', fontSize: '0.8rem' }}>
                        <RefreshCcw size={12} style={{ color: '#C9A84C' }} />
                        {event.recurrence_pattern}
                      </span>
                    )}
                    {event.event_time && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(240,235,225,0.45)', fontSize: '0.8rem' }}>
                        <Clock size={12} style={{ color: '#C9A84C' }} />
                        {event.event_time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Private events CTA */}
        <div className="card" style={{ marginTop: '5rem', borderRadius: '1.5rem', borderColor: 'rgba(201,168,76,0.22)', padding: 'clamp(2.5rem, 5vw, 4rem)', textAlign: 'center' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, color: '#F0EBE1', marginBottom: '1rem' }}>
            Planning a Private Event?
          </h2>
          <p style={{ color: 'rgba(240,235,225,0.60)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '36rem', marginInline: 'auto', lineHeight: 1.7 }}>
            From weddings to corporate retreats, our expert events team will make your vision a reality. Contact us for custom packages.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', justifyContent: 'center' }}>
            <Link href="/services/events" className="btn-gold" style={{ padding: '0.875rem 1.75rem', borderRadius: '9999px' }}>Events &amp; Weddings</Link>
            <Link href="/contact" className="btn-outline" style={{ padding: '0.875rem 1.75rem', borderRadius: '9999px' }}>Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
