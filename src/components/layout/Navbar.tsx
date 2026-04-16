'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Restaurant & Menu', href: '/menu' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [siteName, setSiteName] = useState('The Audrey Golf Resort');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.logo_url) setLogoUrl(data.logo_url);
        if (data.site_name) setSiteName(data.site_name);
      })
      .catch(() => {});
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[#0D0D0D]/95 backdrop-blur-md shadow-lg border-b border-[#C9A84C]/20'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={siteName}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-[#C9A84C] flex items-center justify-center">
                <span className="text-[#C9A84C] font-bold text-lg">A</span>
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-[#C9A84C] font-bold text-lg leading-tight tracking-wide">{siteName}</p>
              <p className="text-white/50 text-xs tracking-widest uppercase">Golf Resort</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm tracking-wide font-medium uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+254780306086"
              className="flex items-center gap-2 text-[#C9A84C] text-sm hover:text-[#E8C96B] transition-colors"
            >
              <Phone size={14} />
              <span>+254 780 306086</span>
            </a>
            <Link
              href="/services/restaurant"
              className="btn-gold px-5 py-2.5 rounded-full text-sm font-semibold"
            >
              Book a Table
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white hover:text-[#C9A84C] transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0D0D0D]/98 backdrop-blur-md border-t border-[#C9A84C]/20">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white/80 hover:text-[#C9A84C] transition-colors py-2 text-sm tracking-wide uppercase border-b border-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/services/restaurant"
              onClick={() => setIsOpen(false)}
              className="block btn-gold text-center py-3 rounded-full text-sm font-semibold mt-4"
            >
              Book a Table
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
