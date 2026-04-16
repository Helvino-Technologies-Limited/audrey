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
  bed: <BedDouble size={32} />,
  utensils: <UtensilsCrossed size={32} />,
  trophy: <Trophy size={32} />,
  waves: <Waves size={32} />,
  presentation: <Monitor size={32} />,
  music: <Music2 size={32} />,
  star: <Star size={32} />,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data: Service[]) => {
        setServices(data.filter(s => s.is_active));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Page Header */}
      <div className="relative pt-32 pb-20 bg-gradient-to-b from-[#1A1200]/50 to-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">Explore</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">
            Our Services
          </h1>
          <div className="divider-gold mx-auto mb-5" />
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            From championship golf to world-class dining and luxury accommodation — everything you need for an unforgettable stay
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card rounded-2xl h-80 shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <div className="glass-card rounded-2xl overflow-hidden hover:border-[#C9A84C]/40 transition-all duration-300 group h-full flex flex-col cursor-pointer">
                  {/* Image */}
                  <div className="relative h-52 bg-gradient-to-br from-[#C9A84C]/10 to-[#0D0D0D] overflow-hidden">
                    {service.image_url ? (
                      <Image
                        src={service.image_url}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#C9A84C]/40">
                        {iconMap[service.icon] || <Star size={48} />}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-7 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
                        <span className="scale-75">{iconMap[service.icon] || <Star size={18} />}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-[#C9A84C] transition-colors">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed flex-1 mb-5">
                      {service.short_description}
                    </p>

                    {service.features && service.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1.5">
                        <div className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                        <span className="text-white/50 text-xs">{f}</span>
                      </div>
                    ))}

                    <div className="flex items-center justify-between mt-5 pt-5 border-t border-white/10">
                      <span className="text-[#C9A84C] text-sm font-semibold">{service.price_info}</span>
                      <span className="flex items-center gap-1 text-[#C9A84C] text-sm font-medium group-hover:gap-2 transition-all">
                        Book Now <ArrowRight size={14} />
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
