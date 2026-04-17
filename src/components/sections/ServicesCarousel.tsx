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
  bed: <BedDouble size={28} />,
  utensils: <UtensilsCrossed size={28} />,
  trophy: <Trophy size={28} />,
  waves: <Waves size={28} />,
  presentation: <Monitor size={28} />,
  music: <Music2 size={28} />,
  star: <Star size={28} />,
};

const placeholderColors = [
  'from-amber-900/50 to-yellow-950',
  'from-green-900/50 to-emerald-950',
  'from-blue-900/50 to-indigo-950',
  'from-cyan-900/50 to-teal-950',
  'from-purple-900/50 to-violet-950',
  'from-rose-900/50 to-pink-950',
  'from-orange-900/50 to-red-950',
];

const STATIC_SERVICES: Service[] = [
  { id: 1, slug: 'accommodation', title: 'Accommodation', icon: 'bed', short_description: 'Luxurious furnished rooms with scenic countryside views and world-class amenities.', price_info: 'From KES 5,000/night', image_url: null, is_active: true },
  { id: 2, slug: 'restaurant', title: 'Fine Dining', icon: 'utensils', short_description: 'Authentic Kenyan flavours crafted from farm-fresh ingredients with timeless elegance.', price_info: 'From KES 500/dish', image_url: null, is_active: true },
  { id: 3, slug: 'golf', title: 'Golf Course', icon: 'trophy', short_description: 'Championship 18-hole golf on our meticulously maintained scenic greens.', price_info: 'From KES 2,000/round', image_url: null, is_active: true },
  { id: 4, slug: 'swimming-pool', title: 'Swimming Pool', icon: 'waves', short_description: 'Olympic-size pool with lessons, aqua aerobics and poolside bar service.', price_info: 'From KES 500/session', image_url: null, is_active: true },
  { id: 5, slug: 'conference', title: 'Conference Hall', icon: 'presentation', short_description: '200-delegate state-of-the-art conference hall with full AV support.', price_info: 'From KES 50,000/day', image_url: null, is_active: true },
  { id: 6, slug: 'bar-entertainment', title: 'Bar & Entertainment', icon: 'music', short_description: 'Live music every Friday & Saturday, craft cocktails and a vibrant atmosphere.', price_info: 'From KES 200/drink', image_url: null, is_active: true },
  { id: 7, slug: 'events', title: 'Events & Weddings', icon: 'star', short_description: 'Unforgettable weddings, corporate functions and private celebrations.', price_info: 'Contact us for pricing', image_url: null, is_active: true },
];

export default function ServicesCarousel() {
  const [services, setServices] = useState<Service[]>(STATIC_SERVICES);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
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
    <section className="py-24 bg-[#0D0D0D] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">What We Offer</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
            Our Signature Services
          </h2>
          <div className="divider-gold mx-auto mb-5" />
          <p className="text-white/60 max-w-xl mx-auto text-base leading-relaxed">
            From championship golf to world-class dining, discover everything The Audrey Resort has to offer
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-6">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {services.map((service, idx) => (
                <div key={service.id} className="flex-none w-[280px] sm:w-[320px] lg:w-[360px]">
                  <Link href={`/services/${service.slug}`}>
                    <div className="glass-card rounded-2xl overflow-hidden hover:border-[#C9A84C]/50 transition-all duration-300 group h-[420px] flex flex-col cursor-pointer">
                      {/* Image/Placeholder */}
                      <div className="relative h-48 overflow-hidden">
                        {service.image_url ? (
                          <Image
                            src={service.image_url}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${placeholderColors[idx % placeholderColors.length]} flex items-center justify-center relative`}>
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A84C' fill-opacity='0.3'%3E%3Cpath d='M20 18v4h-4v-4h4zm-4-4h4V10h-4v4zm8 0h-4V10h4v4zm0 4h4v-4h-4v4z'/%3E%3C/g%3E%3C/svg%3E")` }} />
                            <div className="text-[#C9A84C] opacity-70 relative z-10">
                              {iconMap[service.icon] || <Star size={40} />}
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent" />
                        {/* Icon badge */}
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
                          <span className="scale-75">{iconMap[service.icon] || <Star size={18} />}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-[#C9A84C] transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed flex-1 line-clamp-3">
                          {service.short_description}
                        </p>
                        <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
                          <span className="text-[#C9A84C] text-sm font-semibold">
                            {service.price_info}
                          </span>
                          <span className="flex items-center gap-1 text-[#C9A84C] text-sm font-medium group-hover:gap-2 transition-all">
                            Book Now <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all shadow-xl z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all shadow-xl z-10"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-gold px-8 py-3 rounded-full text-sm font-semibold tracking-wide uppercase inline-block">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
