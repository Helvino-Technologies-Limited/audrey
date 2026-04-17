'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, BedDouble, UtensilsCrossed, Trophy, Waves, Monitor, Music2, Star, ArrowRight } from 'lucide-react';

interface Service {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  price_info: string;
  image_url: string | null;
  icon: string;
  is_active: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  bed: <BedDouble size={32} />,
  utensils: <UtensilsCrossed size={32} />,
  trophy: <Trophy size={32} />,
  waves: <Waves size={32} />,
  presentation: <Monitor size={32} />,
  music: <Music2 size={32} />,
  star: <Star size={32} />,
};

const STATIC_SERVICES: Service[] = [
  { id: 1, slug: 'accommodation', title: 'Accommodation', icon: 'bed', short_description: 'Luxurious furnished rooms with scenic countryside views and world-class amenities.', price_info: 'From KES 5,000/night', image_url: null, is_active: true },
  { id: 2, slug: 'restaurant', title: 'Fine Dining', icon: 'utensils', short_description: 'Authentic Kenyan flavours crafted from farm-fresh ingredients with timeless elegance.', price_info: 'From KES 500/dish', image_url: null, is_active: true },
  { id: 3, slug: 'golf', title: 'Golf Course', icon: 'trophy', short_description: 'Championship 18-hole golf on our meticulously maintained scenic greens.', price_info: 'From KES 2,000/round', image_url: null, is_active: true },
  { id: 4, slug: 'swimming-pool', title: 'Swimming Pool', icon: 'waves', short_description: 'Olympic-size pool with lessons, aqua aerobics and poolside bar service.', price_info: 'From KES 500/session', image_url: null, is_active: true },
  { id: 5, slug: 'conference', title: 'Conference Hall', icon: 'presentation', short_description: '200-delegate state-of-the-art conference hall with full AV support.', price_info: 'From KES 50,000/day', image_url: null, is_active: true },
  { id: 6, slug: 'bar-entertainment', title: 'Bar & Entertainment', icon: 'music', short_description: 'Live music every Friday & Saturday, craft cocktails and a vibrant atmosphere.', price_info: 'From KES 200/drink', image_url: null, is_active: true },
  { id: 7, slug: 'events', title: 'Events & Weddings', icon: 'star', short_description: 'Unforgettable weddings, corporate functions and private celebrations.', price_info: 'Contact us for pricing', image_url: null, is_active: true },
];

const ICON_COLORS = [
  'var(--gold)', '#4CAF9A', '#5B8CE8', 'var(--gold)', '#9C7CE8', '#E87C5B', 'var(--gold)',
];

export default function ServicesCarousel() {
  const [services, setServices] = useState<Service[]>(STATIC_SERVICES);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 4500, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data: Service[]) => {
        const active = data.filter(s => s.is_active);
        if (active.length > 0) setServices(active);
      })
      .catch(() => {});
  }, []);

  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-base)', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="section-label">What We Offer</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Our Signature Services
          </h2>
          <div className="divider-gold" style={{ margin: '0 auto 1.25rem' }} />
          <p style={{ color: 'rgba(240,235,225,0.60)', maxWidth: '36rem', margin: '0 auto', fontSize: '1rem', lineHeight: 1.7 }}>
            From championship golf to world-class dining, discover everything The Audrey Resort has to offer
          </p>
        </div>

        {/* Carousel */}
        <div style={{ position: 'relative', padding: '0 2.5rem' }}>
          <div style={{ overflow: 'hidden' }} ref={emblaRef}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {services.map((service, idx) => (
                <div key={service.id} style={{ flexShrink: 0, width: 'clamp(260px, 30vw, 340px)' }}>
                  <Link href={`/services/${service.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="card" style={{
                      height: '420px',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      transition: 'border-color 0.25s, transform 0.25s',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(var(--gold-rgb),0.45)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                    >
                      {/* Image area */}
                      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', flexShrink: 0 }}>
                        {service.image_url ? (
                          <Image src={service.image_url} alt={service.title} fill style={{ objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%',
                            background: `linear-gradient(135deg, rgba(var(--gold-rgb),0.12) 0%, #0D0D0D 100%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <span style={{ color: ICON_COLORS[idx % ICON_COLORS.length], opacity: 0.7, transform: 'scale(1.5)' }}>
                              {iconMap[service.icon] || <Star size={40} />}
                            </span>
                          </div>
                        )}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #161616 0%, transparent 60%)' }} />
                        {/* Icon badge */}
                        <div style={{
                          position: 'absolute', top: '0.75rem', right: '0.75rem',
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(var(--gold-rgb),0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--gold)',
                        }}>
                          <span style={{ transform: 'scale(0.65)' }}>{iconMap[service.icon] || <Star size={16} />}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 className="font-display" style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.625rem' }}>
                          {service.title}
                        </h3>
                        <p style={{ color: 'rgba(240,235,225,0.60)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                          {service.short_description}
                        </p>
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--gold)', fontSize: '0.875rem', fontWeight: 600 }}>{service.price_info}</span>
                          <span style={{ color: 'var(--gold)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Book <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Prev / Next */}
          <button onClick={scrollPrev} style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--bg-card-2)', border: '1px solid rgba(var(--gold-rgb),0.35)',
            color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', zIndex: 10,
          }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={scrollNext} style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--bg-card-2)', border: '1px solid rgba(var(--gold-rgb),0.35)',
            color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', zIndex: 10,
          }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/services" className="btn-gold" style={{ padding: '0.75rem 2rem', borderRadius: '9999px' }}>
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
