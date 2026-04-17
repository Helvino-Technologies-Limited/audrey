'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CTASection() {
  const [content, setContent] = useState({
    title: 'Ready for an Unforgettable Experience?',
    subtitle: 'Book your stay or table today and let us create memories that will last a lifetime.',
  });

  useEffect(() => {
    fetch('/api/page-content?page=home')
      .then(r => r.json())
      .then((data: Record<string, Record<string, string>>) => {
        if (data?.cta) {
          setContent({
            title: data.cta.title || content.title,
            subtitle: data.cta.subtitle || content.subtitle,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '200px', background: 'radial-gradient(ellipse, rgba(var(--gold-rgb),0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        <div className="card" style={{
          borderColor: 'rgba(var(--gold-rgb),0.22)',
          borderRadius: '1.5rem',
          padding: 'clamp(2.5rem, 5vw, 4rem)',
          textAlign: 'center',
          maxWidth: '56rem',
          margin: '0 auto',
        }}>
          <p className="section-label">Book Now</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            {content.title}
          </h2>
          <div className="divider-gold" style={{ margin: '0 auto 1.25rem' }} />
          <p style={{ color: 'rgba(240,235,225,0.62)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '36rem', marginInline: 'auto' }}>
            {content.subtitle}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', justifyContent: 'center' }}>
            <Link href="/services/accommodation" className="btn-gold" style={{ padding: '0.875rem 1.75rem', borderRadius: '9999px' }}>
              Book Accommodation
            </Link>
            <Link href="/menu" className="btn-outline" style={{ padding: '0.875rem 1.75rem', borderRadius: '9999px' }}>
              Order Food
            </Link>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0.875rem 1.75rem', borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(240,235,225,0.65)',
              fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s',
            }}>
              Enquire About Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
