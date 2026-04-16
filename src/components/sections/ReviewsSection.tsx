'use client';

import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  title: string;
  body: string;
  service: string;
  created_at: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch('/api/reviews?featured=true')
      .then(r => r.json())
      .then(setReviews)
      .catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">Testimonials</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
            What Our Guests Say
          </h2>
          <div className="divider-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="glass-card rounded-2xl p-8 hover:border-[#C9A84C]/30 transition-all">
              <Quote size={32} className="text-[#C9A84C]/30 mb-4" />
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={16}
                    className={i <= review.rating ? 'star-filled fill-[#C9A84C]' : 'star-empty'}
                  />
                ))}
              </div>
              {review.title && (
                <h4 className="text-white font-semibold mb-3">{review.title}</h4>
              )}
              <p className="text-white/65 text-sm leading-relaxed mb-6 line-clamp-3">{review.body}</p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-white font-medium text-sm">{review.customer_name}</p>
                  {review.service && (
                    <p className="text-[#C9A84C] text-xs capitalize">{review.service}</p>
                  )}
                </div>
                <p className="text-white/30 text-xs">
                  {new Date(review.created_at).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
