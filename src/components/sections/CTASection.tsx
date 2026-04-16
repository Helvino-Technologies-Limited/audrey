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
    <section className="py-24 bg-[#111111] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="border border-[#C9A84C]/20 rounded-3xl p-12 md:p-16 glass-card">
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">Book Now</p>
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            {content.title}
          </h2>
          <div className="divider-gold mx-auto mb-5" />
          <p className="text-white/65 text-base md:text-lg mb-10 leading-relaxed">
            {content.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services/accommodation"
              className="btn-gold px-8 py-4 rounded-full text-sm font-semibold tracking-wide uppercase"
            >
              Book Accommodation
            </Link>
            <Link
              href="/menu"
              className="px-8 py-4 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] text-sm font-semibold tracking-wide uppercase hover:bg-[#C9A84C]/10 transition-all"
            >
              Order Food
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full border border-white/20 text-white/70 text-sm font-semibold tracking-wide uppercase hover:bg-white/5 transition-all"
            >
              Enquire About Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
