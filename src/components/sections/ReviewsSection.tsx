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

const STATIC_REVIEWS: Review[] = [
  {
    id: -1,
    customer_name: 'James Odhiambo',
    rating: 5,
    title: 'Absolutely World-Class',
    body: 'The Audrey Golf Resort exceeded every expectation. The golf course is immaculate, the food is extraordinary, and the staff made us feel like royalty throughout our stay.',
    service: 'golf',
    created_at: new Date().toISOString(),
  },
  {
    id: -2,
    customer_name: 'Amina Wanjiku',
    rating: 5,
    title: 'Perfect Wedding Venue',
    body: 'We held our wedding reception here and it was magical. The events team handled every detail perfectly. The scenic views of Siaya County made for breathtaking photos.',
    service: 'events',
    created_at: new Date().toISOString(),
  },
  {
    id: -3,
    customer_name: 'David Kamau',
    rating: 5,
    title: 'Best Fine Dining in the Region',
    body: 'The restaurant is exceptional — farm-fresh ingredients prepared with incredible skill. The nyama choma and the cocktails at the bar are reason alone to make the trip.',
    service: 'restaurant',
    created_at: new Date().toISOString(),
  },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(STATIC_REVIEWS);

  useEffect(() => {
    fetch('/api/reviews?featured=true')
      .then(r => r.json())
      .then((data: Review[]) => {
        if (Array.isArray(data) && data.length > 0) setReviews(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 bg-[#111111] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4">Testimonials</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
            What Our Guests Say
          </h2>
          <div className="divider-gold mx-auto mb-5" />
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} size={18} className="fill-[#C9A84C] text-[#C9A84C]" />)}
          </div>
          <p className="text-white/50 text-sm">4.8 average rating from our guests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="glass-card rounded-2xl p-8 hover:border-[#C9A84C]/30 transition-all flex flex-col">
              <Quote size={32} className="text-[#C9A84C]/40 mb-5" />
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={14}
                    className={i <= review.rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-white/20'}
                  />
                ))}
              </div>
              {review.title && (
                <h4 className="text-white font-semibold mb-3 font-display">{review.title}</h4>
              )}
              <p className="text-white/65 text-sm leading-relaxed flex-1 mb-6 line-clamp-3">{review.body}</p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-white font-medium text-sm">{review.customer_name}</p>
                  {review.service && (
                    <p className="text-[#C9A84C] text-xs capitalize mt-0.5">{review.service}</p>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] text-sm font-bold">
                  {review.customer_name.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
