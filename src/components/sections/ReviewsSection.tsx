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
  { id: -1, customer_name: 'James Odhiambo', rating: 5, title: 'Absolutely World-Class', body: 'The Audrey Golf Resort exceeded every expectation. The golf course is immaculate, the food is extraordinary, and the staff made us feel like royalty throughout our stay.', service: 'golf', created_at: new Date().toISOString() },
  { id: -2, customer_name: 'Amina Wanjiku', rating: 5, title: 'Perfect Wedding Venue', body: 'We held our wedding reception here and it was magical. The events team handled every detail perfectly. The scenic views of Siaya County made for breathtaking photos.', service: 'events', created_at: new Date().toISOString() },
  { id: -3, customer_name: 'David Kamau', rating: 5, title: 'Best Fine Dining in the Region', body: 'The restaurant is exceptional — farm-fresh ingredients prepared with incredible skill. The nyama choma and the cocktails at the bar are reason alone to make the trip.', service: 'restaurant', created_at: new Date().toISOString() },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(STATIC_REVIEWS);

  useEffect(() => {
    fetch('/api/reviews?featured=true')
      .then(r => r.json())
      .then((data: Review[]) => { if (Array.isArray(data) && data.length > 0) setReviews(data); })
      .catch(() => {});
  }, []);

  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-base)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(var(--gold-rgb),0.25), transparent)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(var(--gold-rgb),0.25), transparent)' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="section-label">Testimonials</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            What Our Guests Say
          </h2>
          <div className="divider-gold" style={{ margin: '0 auto 1.25rem' }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '0.5rem' }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={18} style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />)}
          </div>
          <p style={{ color: 'rgba(240,235,225,0.45)', fontSize: '0.875rem' }}>4.8 average rating from our guests</p>
        </div>

        {/* Review cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {reviews.slice(0, 3).map(review => (
            <div key={review.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s' }}>
              <Quote size={28} style={{ color: 'rgba(var(--gold-rgb),0.35)', marginBottom: '1.25rem' }} />
              <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={13} style={{ fill: i <= review.rating ? 'var(--gold)' : 'transparent', color: i <= review.rating ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }} />
                ))}
              </div>
              {review.title && (
                <h4 className="font-display" style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.75rem', fontSize: '1rem' }}>{review.title}</h4>
              )}
              <p style={{ color: 'rgba(240,235,225,0.62)', fontSize: '0.875rem', lineHeight: 1.65, flex: 1, marginBottom: '1.5rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                {review.body}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                <div>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>{review.customer_name}</p>
                  {review.service && (
                    <p style={{ color: 'var(--gold)', fontSize: '0.75rem', textTransform: 'capitalize', marginTop: '2px' }}>{review.service}</p>
                  )}
                </div>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(var(--gold-rgb),0.15)', border: '1px solid rgba(var(--gold-rgb),0.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold)', fontWeight: 700, fontSize: '0.875rem',
                }}>
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
