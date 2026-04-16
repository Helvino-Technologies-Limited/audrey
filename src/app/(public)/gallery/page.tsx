'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  category: string;
}

const categories = ['All', 'Accommodation', 'Restaurant', 'Golf', 'Pool', 'Events', 'General'];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="pt-32 pb-16 bg-gradient-to-b from-[#1A1200]/50 to-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">Visual Journey</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">Gallery</h1>
          <div className="divider-gold mx-auto mb-5" />
          <p className="text-white/60 text-lg">A glimpse into the beauty and elegance of The Audrey Golf Resort</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Filter tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide uppercase transition-all ${
                activeCategory === cat ? 'bg-[#C9A84C] text-black' : 'border border-white/20 text-white/60 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-square glass-card rounded-xl shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">No gallery items yet</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="break-inside-avoid relative overflow-hidden rounded-xl cursor-pointer group"
              >
                <Image
                  src={item.image_url}
                  alt={item.title || 'Gallery image'}
                  width={400}
                  height={300}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                  {item.title && (
                    <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium">{item.title}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setLightboxItem(null)}>
          <button className="absolute top-6 right-6 text-white/60 hover:text-white z-10">
            <X size={28} />
          </button>
          <div className="relative max-w-4xl max-h-[80vh] w-full" onClick={e => e.stopPropagation()}>
            <Image
              src={lightboxItem.image_url}
              alt={lightboxItem.title || 'Gallery'}
              width={1200}
              height={800}
              className="object-contain rounded-xl max-h-[80vh] w-full"
            />
            {lightboxItem.title && (
              <p className="text-white/60 text-center mt-4 text-sm">{lightboxItem.title}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
