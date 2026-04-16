'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

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

  return (
    <section className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#C9A84C]/20 to-[#0D0D0D] border border-[#C9A84C]/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[#C9A84C] text-8xl font-[var(--font-playfair)] font-bold opacity-20">A</div>
                  <div className="text-white/30 text-sm tracking-widest uppercase">The Audrey Golf Resort</div>
                </div>
              </div>
              {/* Decorative borders */}
              <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-[#C9A84C]/40" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-[#C9A84C]/40" />
            </div>

            {/* Stat cards */}
            <div className="absolute -bottom-6 -right-6 bg-[#C9A84C] rounded-xl p-5 shadow-2xl">
              <p className="text-black font-bold text-3xl">4.8★</p>
              <p className="text-black/70 text-xs font-semibold uppercase tracking-wide">Guest Rating</p>
            </div>
            <div className="absolute -top-6 -left-6 bg-[#1A1A1A] border border-[#C9A84C]/30 rounded-xl p-5 shadow-2xl">
              <p className="text-[#C9A84C] font-bold text-3xl">200+</p>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Happy Guests</p>
            </div>
          </div>

          {/* Right: content */}
          <div>
            <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">About Us</p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
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
