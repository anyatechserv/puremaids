'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCustomer } from '@/lib/customer-auth';
import { supabase } from '@/lib/supabase';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  id: string; reference: string; service_type: string; preferred_date: string;
}
interface Review {
  id: string; booking_id: string; rating: number; title: string | null; body: string | null;
}

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic Cleaning', deep: 'Deep Cleaning',
  end_of_tenancy: 'End of Tenancy Cleaning', office: 'Office Cleaning',
};

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star className={cn('w-8 h-8', (hovered || value) >= n ? 'fill-amber-400 text-amber-400' : 'text-secondary-200')} />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ booking, existing, onSaved }: {
  booking: Booking;
  existing: Review | null;
  onSaved: (r: Review) => void;
}) {
  const { user } = useCustomer();
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user || rating === 0) { setError('Please select a star rating.'); return; }
    setSaving(true); setError('');
    if (existing) {
      const { error: e } = await supabase.from('reviews')
        .update({ rating, title: title || null, body: body || null }).eq('id', existing.id);
      if (e) { setError(e.message); setSaving(false); return; }
      onSaved({ ...existing, rating, title: title || null, body: body || null });
    } else {
      const { data, error: e } = await supabase.from('reviews')
        .insert({ user_id: user.id, booking_id: booking.id, rating, title: title || null, body: body || null })
        .select('*').single();
      if (e) { setError(e.message); setSaving(false); return; }
      onSaved(data as Review);
    }
    setSaving(false); setSaved(true);
  };

  if (saved) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-semibold py-2">
        <CheckCircle className="w-4 h-4" /> Review saved — thank you!
      </div>
    );
  }

  return (
    <div className="border-t border-secondary-100 pt-4 mt-2 space-y-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-2">Your Rating</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1.5">Headline (optional)</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Brilliant service!"
          className="w-full h-10 px-3.5 rounded-xl border border-secondary-200 text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-300" />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1.5">Review (optional)</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Tell us about your experience..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-secondary-200 text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
      </div>
      {error && <div className="flex items-center gap-2 text-red-600 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}
      <button onClick={handleSave} disabled={saving || rating === 0}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-xl text-sm hover:bg-primary-600 transition-colors disabled:opacity-60">
        <Star className="w-4 h-4" />
        {saving ? 'Saving...' : existing ? 'Update Review' : 'Submit Review'}
      </button>
    </div>
  );
}

export default function AccountReviewsPage() {
  const { user } = useCustomer();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const [br, rr] = await Promise.all([
      supabase.from('bookings').select('id, reference, service_type, preferred_date')
        .eq('user_id', user.id).eq('status', 'completed').order('preferred_date', { ascending: false }),
      supabase.from('reviews').select('*').eq('user_id', user.id),
    ]);
    setBookings((br.data as Booking[]) ?? []);
    setReviews((rr.data as Review[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleSaved = (r: Review) =>
    setReviews((prev) => prev.some((x) => x.id === r.id) ? prev.map((x) => x.id === r.id ? r : x) : [...prev, r]);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-secondary-800 mb-1">My Reviews</h1>
      <p className="text-secondary-400 text-sm mb-6">Leave feedback for your completed cleans.</p>

      {loading
        ? <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-secondary-100 animate-pulse" />)}</div>
        : bookings.length === 0
        ? (
          <div className="bg-white rounded-2xl border border-secondary-100 p-12 text-center shadow-soft">
            <Star className="w-10 h-10 text-secondary-200 mx-auto mb-3" />
            <p className="font-semibold text-secondary-600">No completed bookings yet</p>
            <p className="text-secondary-400 text-sm mt-1">Reviews appear once your cleaning is marked complete.</p>
          </div>
        )
        : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const existing = reviews.find((r) => r.booking_id === b.id) ?? null;
              const isOpen = expanded === b.id;
              return (
                <div key={b.id} className="bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden">
                  <button type="button" onClick={() => setExpanded(isOpen ? null : b.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-secondary-50/40 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-xs text-primary-600">{b.reference}</span>
                        {existing
                          ? <span className="flex items-center gap-0.5">{Array.from({ length: existing.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}</span>
                          : <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">Awaiting Review</span>}
                      </div>
                      <p className="text-sm text-secondary-700">{SERVICE_LABELS[b.service_type] ?? b.service_type} · {b.preferred_date}</p>
                    </div>
                    <Star className={cn('w-5 h-5 shrink-0', existing ? 'fill-amber-400 text-amber-400' : 'text-secondary-200')} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5">
                      <ReviewForm booking={b} existing={existing} onSaved={handleSaved} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
