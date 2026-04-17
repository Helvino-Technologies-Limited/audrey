'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Trophy, Star, Users } from 'lucide-react';

export default function AboutSection() {
  const [content, setContent] = useState({
    title: 'Experience Luxury in the Heart of Kenya',
    body: 'Nestled in the serene Siaya County countryside, The Audrey Golf Resort offers an unparalleled escape from the ordinary. Our resort combines world-class hospitality with the natural beauty of Kenya, creating experiences that will leave you breathless.',
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
    { icon: <Trophy size={20} />, value: '18', label: 'Hole Golf Course' },
    { icon: <Users size={20} />, value: '200+', label: 'Happy Guests' },
    { icon: <Star size={20} />, value: '4.8★', label: 'Guest Rating' },
  ];

  return (
    <section className="py-24 bg-[#111111] relative overflow-hidden">
      {/* Background lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: visual */}
          <div className="relative order-2 lg:order-1">
            {/* Main decorative card */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#1a0f00] to-[#0D0D0D] border border-[#C9A84C]/20">
              {/* Inner decoration */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="text-[#C9A84C] font-display font-bold text-[120px] leading-none opacity-[0.06] select-none">A</div>
              </div>

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A84C' stroke-width='0.5'%3E%3Crect x='15' y='15' width='30' height='30'/%3E%3Cline x1='30' y1='0' x2='30' y2='60'/%3E%3Cline x1='0' y1='30' x2='60' y2='30'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px',
                }}
              />

              {/* Corner accents */}
              <div className="absolute top-5 left-5 w-12 h-12 border-l-2 border-t-2 border-[#C9A84C]/50" />
              <div className="absolute top-5 right-5 w-12 h-12 border-r-2 border-t-2 border-[#C9A84C]/50" />
              <div className="absolute bottom-5 left-5 w-12 h-12 border-l-2 border-b-2 border-[#C9A84C]/50" />
              <div className="absolute bottom-5 right-5 w-12 h-12 border-r-2 border-b-2 border-[#C9A84C]/50" />

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center">
                  <p className="text-[#C9A84C] font-display font-bold text-4xl mb-2">The Audrey</p>
                  <p className="text-white/40 text-sm tracking-[0.4em] uppercase">Golf Resort</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="h-px w-8 bg-[#C9A84C]/40" />
                    <div className="w-1 h-1 rounded-full bg-[#C9A84C]/60" />
                    <div className="h-px w-8 bg-[#C9A84C]/40" />
                  </div>
                  <p className="text-white/30 text-xs tracking-[0.3em] uppercase mt-4">Siaya County, Kenya</p>
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="absolute -bottom-6 -right-4 bg-[#C9A84C] rounded-2xl p-5 shadow-2xl shadow-[#C9A84C]/20">
              <p className="text-black font-bold text-3xl font-display">4.8★</p>
              <p className="text-black/70 text-xs font-semibold uppercase tracking-wide mt-0.5">Guest Rating</p>
            </div>
            <div className="absolute -top-6 -left-4 bg-[#1A1A1A] border border-[#C9A84C]/30 rounded-2xl p-5 shadow-2xl">
              <p className="text-[#C9A84C] font-bold text-3xl font-display">200+</p>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mt-0.5">Happy Guests</p>
            </div>
          </div>

          {/* Right: content */}
          <div className="order-1 lg:order-2">
            <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">About Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              {content.title}
            </h2>
            <div className="divider-gold mb-6" />
            <p className="text-white/65 text-base leading-relaxed mb-8">
              {content.body}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
                  <span className="text-white/65 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 glass-card rounded-2xl">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center text-[#C9A84C] mb-1">{stat.icon}</div>
                  <p className="text-white font-bold text-xl font-display">{stat.value}</p>
                  <p className="text-white/40 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/services"
                className="btn-gold px-6 py-3 rounded-full text-sm font-semibold tracking-wide uppercase text-center"
              >
                Explore Services
              </a>
              <a
                href="/contact"
                className="px-6 py-3 rounded-full border border-[#C9A84C]/40 text-[#C9A84C] text-sm font-semibold tracking-wide uppercase text-center hover:bg-[#C9A84C]/10 transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
