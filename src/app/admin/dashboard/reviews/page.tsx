'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Star, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

interface Review {
  id: number;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string;
  body: string;
  service: string;
  is_approved: boolean;
  is_featured: boolean;
  admin_notes: string;
  created_at: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateReview = async (id: number, updates: { is_approved?: boolean; is_featured?: boolean }) => {
    try {
      await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      toast.success(updates.is_approved !== undefined
        ? (updates.is_approved ? 'Review approved!' : 'Review rejected')
        : 'Updated');
    } catch {
      toast.error('Failed to update review');
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm('Delete this review?')) return;
    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      setReviews(prev => prev.filter(r => r.id !== id));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = filter === 'pending'
    ? reviews.filter(r => !r.is_approved)
    : filter === 'approved'
    ? reviews.filter(r => r.is_approved)
    : reviews;

  const pendingCount = reviews.filter(r => !r.is_approved).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Reviews</h1>
        <p className="text-white/40 text-sm">Approve or reject guest reviews before they appear publicly</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-3 mb-6">
        {['pending', 'approved', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f as 'all' | 'pending' | 'approved')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold capitalize transition-all flex items-center gap-2 ${
              filter === f ? 'bg-[#C9A84C] text-black' : 'border border-white/20 text-white/60 hover:border-[#C9A84C]/50'
            }`}>
            {f}
            {f === 'pending' && pendingCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${filter === 'pending' ? 'bg-black/20' : 'bg-yellow-400/20 text-yellow-400'}`}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-40 glass-card rounded-2xl shimmer" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-white/30">
          {filter === 'pending' ? 'No reviews awaiting approval' : 'No reviews found'}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(review => (
            <div key={review.id} className={`glass-card rounded-2xl p-7 ${review.is_approved ? 'border-green-400/10' : 'border-yellow-400/10'} hover:border-[#C9A84C]/20 transition-all`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-white font-semibold">{review.customer_name}</span>
                    {review.customer_email && <span className="text-white/40 text-xs">{review.customer_email}</span>}
                    {review.service && <span className="text-[#C9A84C] text-xs bg-[#C9A84C]/10 px-2 py-0.5 rounded-full capitalize">{review.service}</span>}
                    {review.is_featured && <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-0.5 rounded-full">Featured</span>}
                    {!review.is_approved && <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-0.5 rounded-full">Pending</span>}
                    {review.is_approved && <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded-full">Approved</span>}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={14} className={n <= review.rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-white/20'} />
                    ))}
                  </div>
                </div>
                <span className="text-white/30 text-xs shrink-0">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>

              {review.title && <h4 className="text-white font-semibold mb-2">{review.title}</h4>}
              <p className="text-white/65 text-sm leading-relaxed">{review.body}</p>

              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/10">
                {!review.is_approved ? (
                  <button onClick={() => updateReview(review.id, { is_approved: true })}
                    className="flex items-center gap-2 bg-green-400/10 border border-green-400/20 text-green-400 px-4 py-2 rounded-xl text-sm hover:bg-green-400/20 transition-all">
                    <CheckCircle2 size={14} /> Approve
                  </button>
                ) : (
                  <button onClick={() => updateReview(review.id, { is_approved: false })}
                    className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-4 py-2 rounded-xl text-sm hover:bg-yellow-400/20 transition-all">
                    <XCircle size={14} /> Revoke
                  </button>
                )}
                <button onClick={() => updateReview(review.id, { is_featured: !review.is_featured })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                    review.is_featured ? 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30' : 'border border-white/20 text-white/50 hover:border-[#C9A84C]/40'
                  }`}>
                  <Star size={14} /> {review.is_featured ? 'Unfeature' : 'Feature'}
                </button>
                <button onClick={() => deleteReview(review.id)}
                  className="flex items-center gap-2 border border-red-400/20 text-red-400/60 hover:text-red-400 px-4 py-2 rounded-xl text-sm hover:bg-red-400/5 transition-all ml-auto">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
