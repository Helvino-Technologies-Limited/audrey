'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#C9A84C]/20">
      {/* Top divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {settings.logo_url ? (
                <Image
                  src={settings.logo_url}
                  alt={settings.site_name || 'The Audrey Golf Resort'}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border-2 border-[#C9A84C]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-[#C9A84C] flex items-center justify-center">
                  <span className="text-[#C9A84C] font-bold text-lg">A</span>
                </div>
              )}
              <div>
                <p className="text-[#C9A84C] font-bold text-base leading-tight">
                  {settings.site_name || 'The Audrey Golf Resort'}
                </p>
                <p className="text-white/40 text-xs tracking-widest uppercase">Luxury Resort</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {settings.site_tagline || 'An exclusive golf resort restaurant in the Kenyan countryside.'}
            </p>
            <div className="flex gap-3">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all text-xs font-bold">
                  f
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all">
                  <Globe size={16} />
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all text-xs font-bold">
                  X
                </a>
              )}
              {settings.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all"
                  title="TikTok">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.53V6.75a4.85 4.85 0 0 1-1.02-.06z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Our Services', href: '/services' },
                { label: 'Restaurant & Menu', href: '/menu' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Events', href: '/events' },
                { label: 'Contact Us', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-[#C9A84C] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-6">Our Services</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accommodation', href: '/services/accommodation' },
                { label: 'Fine Dining', href: '/services/restaurant' },
                { label: 'Golf Course', href: '/services/golf' },
                { label: 'Swimming Pool', href: '/services/swimming-pool' },
                { label: 'Conference Hall', href: '/services/conference' },
                { label: 'Events & Weddings', href: '/services/events' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-[#C9A84C] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex gap-3 text-white/60 text-sm">
                <MapPin size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
                <span>{settings.contact_address || 'Segere, Osoro Road, PISOKO Centre, Siaya County, Kenya'}</span>
              </div>
              <div className="flex gap-3 text-white/60 text-sm">
                <Phone size={16} className="text-[#C9A84C] shrink-0" />
                <a href={`tel:${settings.contact_phone}`} className="hover:text-[#C9A84C] transition-colors">
                  {settings.contact_phone || '(+254) 780 306086'}
                </a>
              </div>
              <div className="flex gap-3 text-white/60 text-sm">
                <Mail size={16} className="text-[#C9A84C] shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-[#C9A84C] transition-colors">
                  {settings.contact_email || 'info@theaudreyresort.com'}
                </a>
              </div>
              <div className="flex gap-3 text-white/60 text-sm">
                <Clock size={16} className="text-[#C9A84C] shrink-0" />
                <span>{settings.operating_hours || 'Daily: 6:30 AM – 11 PM'}</span>
              </div>
              {settings.mpesa_till && (
                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-lg p-3 mt-2">
                  <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-wide mb-1">Cashless Payments</p>
                  <p className="text-white/70 text-sm">M-PESA Till: <strong className="text-white">{settings.mpesa_till}</strong></p>
                  <p className="text-white/50 text-xs mt-1">All major cards accepted</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#C9A84C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center">
            © {new Date().getFullYear()} {settings.site_name || 'The Audrey Golf Resort'}. All rights reserved.
          </p>
          <Link href="/admin" className="text-white/20 hover:text-[#C9A84C]/60 text-xs transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
