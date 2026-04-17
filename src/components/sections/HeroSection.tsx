'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Phone } from 'lucide-react';

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getVimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export default function HeroSection() {
  const [content, setContent] = useState({
    title: 'Welcome to The Audrey Golf Resort',
    subtitle: 'An exclusive golf resort in the Kenyan countryside — authentic flavours, world-class golf, timeless elegance.',
  });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/page-content?page=home').then(r => r.json()),
      fetch('/api/settings').then(r => r.json()),
    ]).then(([pageContent, settings]) => {
      if (pageContent?.hero) {
        setContent({
          title: pageContent.hero.title || content.title,
          subtitle: pageContent.hero.subtitle || content.subtitle,
        });
      }
      if (settings?.hero_video_url) setVideoUrl(settings.hero_video_url);
    }).catch(() => {});
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      {videoUrl ? (() => {
        const ytId = getYouTubeId(videoUrl);
        const vimeoId = getVimeoId(videoUrl);
        if (ytId) return (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            allow="autoplay; fullscreen"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', transform: 'scale(1.5)', pointerEvents: 'none' }}
          />
        );
        if (vimeoId) return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`}
            allow="autoplay; fullscreen"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', transform: 'scale(1.2)', pointerEvents: 'none' }}
          />
        );
        // Direct video URL (.mp4 etc.)
        return (
          <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
            <source src={videoUrl} />
          </video>
        );
      })() : (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a0e00 0%, #0D0D0D 50%, #000a05 100%)' }}>
          <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)' }} />
        </div>
      )}

      {/* Overlay */}
      <div className="video-overlay" />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 1.5rem', maxWidth: '56rem', margin: '0 auto', width: '100%' }}>
        {/* Location badge */}
        <div className="fade-in-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.30)',
          borderRadius: '9999px', padding: '0.4rem 1.25rem', marginBottom: '2rem',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
          <span style={{ color: '#C9A84C', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500 }}>
            Siaya County, Kenya
          </span>
        </div>

        <h1
          className="font-display fade-in-up"
          style={{
            fontSize: 'clamp(2.4rem, 7vw, 5rem)',
            fontWeight: 700,
            color: '#F0EBE1',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
            animationDelay: '0.15s',
          }}
        >
          {content.title}
        </h1>

        {/* Gold line divider */}
        <div className="fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem', animationDelay: '0.3s' }}>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A84C' }} />
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
        </div>

        <p
          className="fade-in-up"
          style={{
            color: 'rgba(240,235,225,0.72)',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            maxWidth: '36rem',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
            animationDelay: '0.35s',
          }}
        >
          {content.subtitle}
        </p>

        {/* Action buttons */}
        <div className="fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', animationDelay: '0.5s' }}>
          <Link href="/services" className="btn-gold" style={{ padding: '0.875rem 2rem', borderRadius: '9999px' }}>
            Explore Our Services
          </Link>
          <Link
            href="/menu"
            className="btn-outline"
            style={{ padding: '0.875rem 2rem', borderRadius: '9999px', backdropFilter: 'blur(8px)' }}
          >
            View Menu &amp; Order
          </Link>
        </div>

        {/* Phone */}
        <div className="fade-in-up" style={{ marginTop: '2rem', animationDelay: '0.65s' }}>
          <a href="tel:+254780306086" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(240,235,225,0.45)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}>
            <Phone size={14} />
            (+254) 780 306086
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: 'rgba(240,235,225,0.30)' }}>
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </div>
    </section>
  );
}
