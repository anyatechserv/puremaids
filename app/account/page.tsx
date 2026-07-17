'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string; email?: string } | null>(null);
  const [bookings, setBookings] = useState<Array<{ id: string; reference: string | null; status: string; service_type: string; preferred_date: string }>>([]);
  const [invoices, setInvoices] = useState<Array<{ id: string; invoice_number: string; status: string; total_pence: number }>>([]);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setProfile({ full_name: user.user_metadata?.full_name || 'User', email: user.email });
      const [{ data: b }, { data: inv }] = await Promise.all([
        supabase.from('bookings').select('id, reference, status, service_type, preferred_date').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('invoices').select('id, invoice_number, status, total_pence').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      setBookings(b || []);
      setInvoices(inv || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  if (loading) return <div className="section py-20"><div className="mx-auto max-w-2xl text-center text-gray-500">Loading...</div></div>;

  return (
    <div className="section py-12">
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="heading-2">My Account</h1><p className="text-gray-500">{profile?.email}</p></div>
        <button onClick={handleLogout} className="btn-secondary">Sign Out</button>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="heading-3 mb-4">My Bookings</h2>
          {bookings.length === 0 ? <p className="text-gray-500">No bookings yet.</p> : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className="card">
                  <div className="flex justify-between"><span className="font-medium">{b.reference || 'Pending'}</span><span className="badge-brand">{b.status}</span></div>
                  <p className="text-sm text-gray-500">{b.service_type} - {b.preferred_date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="heading-3 mb-4">My Invoices</h2>
          {invoices.length === 0 ? <p className="text-gray-500">No invoices yet.</p> : (
            <div className="space-y-3">
              {invoices.map(i => (
                <div key={i.id} className="card">
                  <div className="flex justify-between"><span className="font-medium">{i.invoice_number}</span><span className="badge-accent">{i.status}</span></div>
                  <p className="text-sm text-gray-500">Total: {(i.total_pence / 100).toFixed(2)} GBP</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
