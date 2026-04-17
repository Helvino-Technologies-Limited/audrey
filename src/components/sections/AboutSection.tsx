'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Trophy, Star, Users } from 'lucide-react';

export default function AboutSection() {
  const [content, setContent] = useState({
    title: 'Experience Luxury in the Heart of Kenya',
    body: 'Nestled in the serene Siaya County countryside, The Audrey Golf Resort offers an unparalleled escape from the ordinary. Our resort combines world-class hospitality with the natural beauty of Kenya, creating experiences that leave you breathless.',
  });

  useEffect(() => {
    fetch('/api/page-content?page=home')
      .then(r => r.json())
      .then((data: Record<string, Record<string, string>>) => {
        if (data?.about) {
          setContent({
            title: data.about.title || content.title,
            body: data.about.body || content.body,
          });
        }
      })
      .catch(() => {});
  }, []);

  const highlights = [
    'Farm-to-table authentic Kenyan cuisine',
    '18-hole championship golf course',
    'Olympic-size swimming pool',
    'Conference hall for 200 delegates',
    'Live music every Friday & Saturday',
    'Scenic Siaya County countryside views',
  ];

  const stats = [
    { icon: <Trophy size={22} />, value: '18', label: 'Hole Golf Course' },
    { icon: <Users size={22} />, value: '200+', label: 'Happy Guests' },
    { icon: <Star size={22} />, value: '4.8★', label: 'Guest Rating' },
  ];

  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-card)', position: 'relative' }}>
      {/* Top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(var(--gold-rgb),0.25), transparent)' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

          {/* Left — decorative visual */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '1.25rem',
              aspectRatio: '4/3',
              background: 'linear-gradient(135deg, #1a0e00 0%, #111111 100%)',
              border: '1px solid rgba(var(--gold-rgb),0.18)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Corner accents */}
              {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v, h]) => (
                <div key={`${v}${h}`} style={{
                  position: 'absolute',
                  [v]: '1.25rem', [h]: '1.25rem',
                  width: '2.5rem', height: '2.5rem',
                  borderTop: v === 'top' ? '2px solid rgba(var(--gold-rgb),0.45)' : undefined,
                  borderBottom: v === 'bottom' ? '2px solid rgba(var(--gold-rgb),0.45)' : undefined,
                  borderLeft: h === 'left' ? '2px solid rgba(var(--gold-rgb),0.45)' : undefined,
                  borderRight: h === 'right' ? '2px solid rgba(var(--gold-rgb),0.45)' : undefined,
                }} />
              ))}
              {/* Center content */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <p className="font-display" style={{ color: 'var(--gold)', fontSize: '2.5rem', fontWeight: 700 }}>The Audrey</p>
                <p style={{ color: 'rgba(240,235,225,0.40)', fontSize: '0.75rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Golf Resort</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ width: '32px', height: '1px', background: 'rgba(var(--gold-rgb),0.40)' }} />
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(var(--gold-rgb),0.60)' }} />
                  <div style={{ width: '32px', height: '1px', background: 'rgba(var(--gold-rgb),0.40)' }} />
                </div>
                <p style={{ color: 'rgba(240,235,225,0.30)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '0.5rem' }}>Siaya County, Kenya</p>
              </div>
            </div>

            {/* Floating stat badges */}
            <div style={{
              position: 'absolute', bottom: '-1.25rem', right: '-0.75rem',
              background: 'var(--gold)', borderRadius: '1rem', padding: '0.875rem 1.25rem',
              boxShadow: '0 8px 32px rgba(var(--gold-rgb),0.25)',
            }}>
              <p className="font-display" style={{ color: 'var(--bg-base)', fontWeight: 700, fontSize: '1.75rem', lineHeight: 1 }}>4.8★</p>
              <p style={{ color: 'rgba(var(--bg-rgb),0.65)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Guest Rating</p>
            </div>
            <div style={{
              position: 'absolute', top: '-1.25rem', left: '-0.75rem',
              background: 'var(--bg-card-2)', border: '1px solid rgba(var(--gold-rgb),0.30)',
              borderRadius: '1rem', padding: '0.875rem 1.25rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}>
              <p className="font-display" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.75rem', lineHeight: 1 }}>200+</p>
              <p style={{ color: 'rgba(240,235,225,0.50)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Happy Guests</p>
            </div>
          </div>

          {/* Right — content */}
          <div>
            <p className="section-label">About Us</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              {content.title}
            </h2>
            <div className="divider-gold" style={{ marginBottom: '1.5rem' }} />
            <p style={{ color: 'rgba(240,235,225,0.65)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem' }}>
              {content.body}
            </p>

            {/* Highlights grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem 1.5rem', marginBottom: '2rem' }}>
              {highlights.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: 'rgba(240,235,225,0.65)', fontSize: '0.875rem' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
              {stats.map((stat, i) => (
                <div key={i} className="card" style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
                  <div style={{ color: 'var(--gold)', display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>{stat.icon}</div>
                  <p className="font-display" style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.375rem' }}>{stat.value}</p>
                  <p style={{ color: 'rgba(240,235,225,0.40)', fontSize: '0.75rem', marginTop: '0.2rem' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <a href="/services" className="btn-gold" style={{ padding: '0.75rem 1.75rem', borderRadius: '9999px' }}>
                Explore Services
              </a>
              <a href="/contact" className="btn-outline" style={{ padding: '0.75rem 1.75rem', borderRadius: '9999px' }}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
