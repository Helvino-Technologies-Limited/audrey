'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Home',      href: '/' },
  { label: 'Services',  href: '/services' },
  { label: 'Menu',      href: '/menu' },
  { label: 'Gallery',   href: '/gallery' },
  { label: 'Events',    href: '/events' },
  { label: 'Contact',   href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl]   = useState<string | null>(null);
  const [siteName, setSiteName] = useState('The Audrey Golf Resort');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.logo_url) setLogoUrl(d.logo_url);
        if (d.site_name) setSiteName(d.site_name);
      })
      .catch(() => {});
  }, []);

  const navBg = scrolled
    ? 'rgba(var(--bg-rgb),0.96)'
    : 'transparent';
  const navBorder = scrolled
    ? '1px solid rgba(var(--gold-rgb),0.18)'
    : '1px solid transparent';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: navBg,
      borderBottom: navBorder,
      backdropFilter: scrolled ? 'blur(12px)' : undefined,
      transition: 'background 0.4s, border-color 0.4s',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            {logoUrl ? (
              <Image src={logoUrl} alt={siteName} width={44} height={44} style={{ borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                border: '2px solid #C9A84C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)', fontWeight: 700, fontSize: '1.125rem',
                fontFamily: 'Georgia, serif',
              }}>A</div>
            )}
            <div>
              <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.0625rem', lineHeight: 1.2, margin: 0 }}>{siteName}</p>
              <p style={{ color: 'rgba(240,235,225,0.40)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Golf Resort</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="nav-desktop">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                color: 'rgba(240,235,225,0.78)', textDecoration: 'none',
                fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.06em',
                textTransform: 'uppercase', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,235,225,0.78)')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="nav-desktop">
            <a href="tel:+254780306086" style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              color: 'var(--gold)', fontSize: '0.8125rem', textDecoration: 'none', transition: 'color 0.2s',
            }}>
              <Phone size={13} />
              +254 780 306086
            </a>
            <Link href="/services/restaurant" className="btn-gold" style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.8rem' }}>
              Book a Table
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem', display: 'none' }}
            className="nav-mobile-btn"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div style={{
          background: 'rgba(var(--bg-rgb),0.98)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(var(--gold-rgb),0.18)',
          padding: '1.25rem 1.5rem 1.5rem',
        }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} style={{
              display: 'block', padding: '0.75rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(240,235,225,0.78)', textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {link.label}
            </Link>
          ))}
          <Link href="/services/restaurant" onClick={() => setIsOpen(false)} className="btn-gold" style={{
            display: 'block', textAlign: 'center', marginTop: '1rem',
            padding: '0.875rem', borderRadius: '9999px',
          }}>
            Book a Table
          </Link>
        </div>
      )}

      {/* Responsive: hide desktop nav on small screens */}
      <style>{`
        @media (max-width: 1023px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
