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
  'from-amber-900/40 to-yellow-900/20',
  'from-green-900/40 to-emerald-900/20',
  'from-blue-900/40 to-indigo-900/20',
  'from-cyan-900/40 to-teal-900/20',
  'from-purple-900/40 to-violet-900/20',
  'from-rose-900/40 to-pink-900/20',
  'from-orange-900/40 to-red-900/20',
];

export default function ServicesCarousel() {
  const [services, setServices] = useState<Service[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data: Service[]) => setServices(data.filter(s => s.is_active)))
      .catch(() => {});
  }, []);

  if (services.length === 0) return null;

  return (
    <section className="py-24 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">What We Offer</p>
          <h2 className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold text-white mb-5">
            Our Signature Services
          </h2>
          <div className="divider-gold mx-auto mb-5" />
          <p className="text-white/60 max-w-xl mx-auto text-base">
            From championship golf to world-class dining, discover everything The Audrey Resort has to offer
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {services.map((service, idx) => (
                <div
                  key={service.id}
                  className="flex-none w-[300px] sm:w-[340px] lg:w-[380px]"
                >
                  <Link href={`/services/${service.slug}`}>
                    <div className="glass-card rounded-2xl overflow-hidden hover:border-[#C9A84C]/40 transition-all duration-300 group h-[440px] flex flex-col cursor-pointer">
                      {/* Image/Placeholder */}
                      <div className="relative h-52 overflow-hidden">
                        {service.image_url ? (
                          <Image
                            src={service.image_url}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${placeholderColors[idx % placeholderColors.length]} flex items-center justify-center`}>
                            <div className="text-[#C9A84C] opacity-60">
                              {iconMap[service.icon] || <Star size={40} />}
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
                        {/* Icon badge */}
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#C9A84C]/20 backdrop-blur-sm border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
                          <span className="scale-75">{iconMap[service.icon] || <Star size={18} />}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        <h3 className="font-[var(--font-playfair)] text-xl font-bold text-white mb-3 group-hover:text-[#C9A84C] transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed flex-1 line-clamp-3">
                          {service.short_description}
                        </p>
                        <div className="mt-5 flex items-center justify-between">
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
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all shadow-lg z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all shadow-lg z-10"
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
