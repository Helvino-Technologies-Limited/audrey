'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, UtensilsCrossed, Trophy, Waves, Monitor, Music2, Star, ArrowRight } from 'lucide-react';

interface Service {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  price_info: string;
  image_url: string | null;
  icon: string;
  is_active: boolean;
  features: string[];
}

const iconMap: Record<string, React.ReactNode> = {
  bed: <BedDouble size={36} />,
  utensils: <UtensilsCrossed size={36} />,
  trophy: <Trophy size={36} />,
  waves: <Waves size={36} />,
  presentation: <Monitor size={36} />,
  music: <Music2 size={36} />,
  star: <Star size={36} />,
};

const STATIC_SERVICES: Service[] = [
  { id: 1, slug: 'accommodation', title: 'Accommodation', icon: 'bed', short_description: 'Luxurious furnished rooms with scenic countryside views and world-class amenities.', price_info: 'From KES 5,000/night', image_url: null, is_active: true, features: [] },
  { id: 2, slug: 'restaurant', title: 'Fine Dining', icon: 'utensils', short_description: 'Authentic Kenyan flavours crafted from farm-fresh ingredients with timeless elegance.', price_info: 'From KES 500/dish', image_url: null, is_active: true, features: [] },
  { id: 3, slug: 'golf', title: 'Golf Course', icon: 'trophy', short_description: 'Championship 18-hole golf on our meticulously maintained scenic greens.', price_info: 'From KES 2,000/round', image_url: null, is_active: true, features: [] },
  { id: 4, slug: 'swimming-pool', title: 'Swimming Pool', icon: 'waves', short_description: 'Olympic-size pool with lessons, aqua aerobics and poolside bar service.', price_info: 'From KES 500/session', image_url: null, is_active: true, features: [] },
  { id: 5, slug: 'conference', title: 'Conference Hall', icon: 'presentation', short_description: '200-delegate state-of-the-art conference hall with full AV support.', price_info: 'From KES 50,000/day', image_url: null, is_active: true, features: [] },
  { id: 6, slug: 'bar-entertainment', title: 'Bar & Entertainment', icon: 'music', short_description: 'Live music every Friday & Saturday, craft cocktails and a vibrant atmosphere.', price_info: 'From KES 200/drink', image_url: null, is_active: true, features: [] },
  { id: 7, slug: 'events', title: 'Events & Weddings', icon: 'star', short_description: 'Unforgettable weddings, corporate functions and private celebrations.', price_info: 'Contact us for pricing', image_url: null, is_active: true, features: [] },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(STATIC_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data: Service[]) => {
        const active = data.filter(s => s.is_active);
        if (active.length > 0) setServices(active);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Page header */}
      <div style={{ paddingTop: '8rem', paddingBottom: '4rem', background: 'linear-gradient(to bottom, rgba(var(--bg-warm-rgb),0.55) 0%, transparent 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <p className="section-label">Explore</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Our Services</h1>
          <div className="divider-gold" style={{ margin: '0 auto 1.5rem' }} />
          <p style={{ color: 'rgba(240,235,225,0.60)', fontSize: '1.0625rem', lineHeight: 1.7 }}>
            From championship golf to world-class dining and luxury accommodation — everything you need for an unforgettable stay
          </p>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4,5,6].map(i => <div key={i} className="card shimmer" style={{ height: '340px' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {services.map(service => (
              <Link key={service.id} href={`/services/${service.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="card" style={{
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  height: '100%', cursor: 'pointer', transition: 'border-color 0.25s, transform 0.25s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(var(--gold-rgb),0.45)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: '200px', background: 'linear-gradient(135deg, rgba(var(--gold-rgb),0.12) 0%, #111111 100%)', overflow: 'hidden' }}>
                    {service.image_url ? (
                      <Image src={service.image_url} alt={service.title} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(var(--gold-rgb),0.40)' }}>
                        {iconMap[service.icon] || <Star size={48} />}
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #161616 0%, transparent 60%)' }} />
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'rgba(var(--gold-rgb),0.10)', border: '1px solid rgba(var(--gold-rgb),0.20)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--gold)', flexShrink: 0,
                      }}>
                        <span style={{ transform: 'scale(0.65)' }}>{iconMap[service.icon]}</span>
                      </div>
                      <h3 className="font-display" style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
                        {service.title}
                      </h3>
                    </div>
                    <p style={{ color: 'rgba(240,235,225,0.60)', fontSize: '0.875rem', lineHeight: 1.65, flex: 1, marginBottom: '1.25rem' }}>
                      {service.short_description}
                    </p>

                    {service.features && service.features.slice(0, 3).map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                        <span style={{ color: 'rgba(240,235,225,0.50)', fontSize: '0.8rem' }}>{f}</span>
                      </div>
                    ))}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ color: 'var(--gold)', fontSize: '0.875rem', fontWeight: 600 }}>{service.price_info}</span>
                      <span style={{ color: 'var(--gold)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Book Now <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
