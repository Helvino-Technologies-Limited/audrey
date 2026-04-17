'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Phone } from 'lucide-react';

interface HeroContent {
  title: string;
  subtitle: string;
}

interface Settings {
  hero_video_url?: string;
}

export default function HeroSection() {
  const [content, setContent] = useState<HeroContent>({
    title: 'Welcome to The Audrey Golf Resort',
    subtitle: 'An exclusive golf resort in the Kenyan countryside, serving authentic flavours with timeless elegance',
  });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/page-content?page=home').then(r => r.json()),
      fetch('/api/settings').then(r => r.json()),
    ]).then(([pageContent, settings]: [Record<string, Record<string, string>>, Settings]) => {
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
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-[#0D0D0D]">
          {/* Rich gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f00] via-[#0D0D0D] to-[#000d0a]" />
          {/* Gold glow top-left */}
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#C9A84C]/8 rounded-full blur-3xl" />
          {/* Gold glow bottom-right */}
          <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#C9A84C]/6 rounded-full blur-3xl" />
          {/* Center subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#C9A84C]/4 rounded-full blur-3xl" />
          {/* Geometric pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A84C' stroke-width='0.5'%3E%3Crect x='20' y='20' width='40' height='40'/%3E%3Crect x='10' y='10' width='60' height='60'/%3E%3Cline x1='40' y1='0' x2='40' y2='80'/%3E%3Cline x1='0' y1='40' x2='80' y2='40'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
            }}
          />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 video-overlay" />

      {/* Side accents */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-20 bg-gradient-to-b from-transparent to-[#C9A84C]/40" />
        <div className="writing-mode-vertical text-[#C9A84C]/40 text-xs tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          Siaya County, Kenya
        </div>
        <div className="w-px h-20 bg-gradient-to-t from-transparent to-[#C9A84C]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Location tag */}
        <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full px-5 py-2 mb-8 fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase font-medium">Siaya County, Kenya</p>
        </div>

        <h1
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight fade-in-up"
          style={{ animationDelay: '0.2s', textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}
        >
          {content.title}
        </h1>

        <div className="flex items-center justify-center gap-4 mb-6 fade-in-up" style={{ animationDelay: '0.35s' }}>
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </div>

        <p
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {content.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/services"
            className="btn-gold px-8 py-4 rounded-full text-sm font-semibold tracking-wide uppercase"
          >
            Explore Our Services
          </Link>
          <Link
            href="/menu"
            className="px-8 py-4 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] text-sm font-semibold tracking-wide uppercase hover:bg-[#C9A84C]/10 transition-all backdrop-blur-sm"
          >
            View Menu & Order
          </Link>
        </div>

        {/* Phone CTA */}
        <div className="mt-8 fade-in-up" style={{ animationDelay: '0.75s' }}>
          <a href="tel:+254780306086" className="inline-flex items-center gap-2 text-white/50 hover:text-[#C9A84C] transition-colors text-sm">
            <Phone size={14} />
            <span>(+254) 780 306086</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" />
      </div>
    </section>
  );
}
