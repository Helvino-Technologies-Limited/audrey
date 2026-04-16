'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, UtensilsCrossed, Trophy, Waves, Monitor, Music2, Star, CheckCircle2, ArrowLeft } from 'lucide-react';
import BookingForm from '@/components/ui/BookingForm';

interface Service {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  features: string[];
  price_from: number | null;
  price_info: string;
  image_url: string | null;
  gallery_images: string[];
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  bed: <BedDouble size={24} />,
  utensils: <UtensilsCrossed size={24} />,
  trophy: <Trophy size={24} />,
  waves: <Waves size={24} />,
  presentation: <Monitor size={24} />,
  music: <Music2 size={24} />,
  star: <Star size={24} />,
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/services/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(setService)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-96 glass-card rounded-2xl shimmer mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 glass-card rounded shimmer" />
              <div className="h-32 glass-card rounded shimmer" />
            </div>
            <div className="h-96 glass-card rounded-2xl shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pt-32 pb-24 text-center">
        <h1 className="text-white text-3xl mb-4">Service Not Found</h1>
        <Link href="/services" className="text-[#C9A84C] hover:underline">← Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        {service.image_url ? (
          <Image src={service.image_url} alt={service.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/20 via-[#1A1200] to-[#0D0D0D] flex items-center justify-center">
            <div className="text-[#C9A84C]/20 scale-[3]">
              {iconMap[service.icon] || <Star size={60} />}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services" className="flex items-center gap-2 text-white/50 hover:text-[#C9A84C] transition-colors text-sm mb-4">
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 backdrop-blur-sm border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
              <span className="scale-75">{iconMap[service.icon]}</span>
            </div>
            <span className="text-[#C9A84C] text-sm tracking-widest uppercase">{service.price_info}</span>
          </div>
          <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold text-white">
            {service.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-white mb-5">About This Service</h2>
              <div className="divider-gold mb-5" />
              <p className="text-white/65 text-base leading-relaxed">{service.full_description}</p>
            </div>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="font-[var(--font-playfair)] text-xl font-bold text-white mb-5">What's Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 glass-card rounded-xl p-4">
                      <CheckCircle2 size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
                      <span className="text-white/70 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {service.gallery_images && service.gallery_images.length > 0 && (
              <div>
                <h3 className="font-[var(--font-playfair)] text-xl font-bold text-white mb-5">Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {service.gallery_images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image src={img} alt={`${service.title} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <BookingForm
                serviceId={service.id}
                serviceName={service.title}
                priceInfo={service.price_info}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
