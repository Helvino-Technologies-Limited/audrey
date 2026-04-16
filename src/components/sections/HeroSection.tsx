'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

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
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1A1200] to-[#0D0D0D]">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-2xl" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 video-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-[#C9A84C] text-sm md:text-base tracking-[0.3em] uppercase mb-6 fade-in-up">
          Siaya County, Kenya
        </p>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight fade-in-up"
          style={{ animationDelay: '0.2s' }}>
          {content.title}
        </h1>

        <div className="divider-gold mx-auto mb-6" />

        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up"
          style={{ animationDelay: '0.4s' }}>
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
            className="px-8 py-4 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] text-sm font-semibold tracking-wide uppercase hover:bg-[#C9A84C]/10 transition-all"
          >
            View Menu & Order
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}
