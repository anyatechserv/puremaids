'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCustomer } from '@/lib/customer-auth';
import { supabase } from '@/lib/supabase';
import { MapPin, Plus, Pencil, Trash2, Star, Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Address {
  id: string; label: string; address: string; postcode: string; is_default: boolean;
}

const blank = { label: 'Home', address: '', postcode: '' };

export default function AccountAddressesPage() {
  const { user } = useCustomer();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | 'add' | Address>(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('saved_addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false });
    setAddresses((data as Address[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(blank); setError(''); setModal('add'); };
  const openEdit = (a: Address) => { setForm({ label: a.label, address: a.address, postcode: a.postcode }); setError(''); setModal(a); };

  const handleSave = async () => {
    if (!user || !form.address.trim() || !form.postcode.trim()) {
      setError('Address and postcode are required.'); return;
    }
    setSaving(true); setError('');
    if (modal === 'add') {
      const isFirst = addresses.length === 0;
      const { data, error: e } = await supabase.from('saved_addresses')
        .insert({ user_id: user.id, label: form.label || 'Home', address: form.address, postcode: form.postcode.toUpperCase(), is_default: isFirst })
        .select('*').single();
      if (e) { setError(e.message); setSaving(false); return; }
      setAddresses((prev) => [...prev, data as Address]);
    } else if (modal && typeof modal !== 'string') {
      const { error: e } = await supabase.from('saved_addresses')
        .update({ label: form.label, address: form.address, postcode: form.postcode.toUpperCase() })
        .eq('id', modal.id);
      if (e) { setError(e.message); setSaving(false); return; }
      setAddresses((prev) => prev.map((a) => a.id === (modal as Address).id ? { ...a, ...form, postcode: form.postcode.toUpperCase() } : a));
    }
    setSaving(false); setModal(null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('saved_addresses').delete().eq('id', id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    await supabase.from('saved_addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('saved_addresses').update({ is_default: true }).eq('id', id);
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-secondary-800 mb-1">Saved Addresses</h1>
          <p className="text-secondary-400 text-sm">Your saved property addresses for fast booking.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {loading
        ? <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl border border-secondary-100 animate-pulse" />)}</div>
        : addresses.length === 0
        ? (
          <div className="bg-white rounded-2xl border border-secondary-100 p-12 text-center shadow-soft">
            <MapPin className="w-10 h-10 text-secondary-200 mx-auto mb-3" />
            <p className="font-semibold text-secondary-600 mb-1">No saved addresses yet</p>
            <p className="text-secondary-400 text-sm mb-5">Save your home or office address for faster booking.</p>
            <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-xl text-sm hover:bg-primary-600 transition-colors">
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>
        )
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div key={a.id} className={cn('bg-white rounded-2xl border p-5 shadow-soft', a.is_default ? 'border-primary-200' : 'border-secondary-100')}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', a.is_default ? 'bg-primary-50' : 'bg-secondary-50')}>
                      <MapPin className={cn('w-4 h-4', a.is_default ? 'text-primary-500' : 'text-secondary-400')} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-secondary-800">{a.label}</p>
                      {a.is_default && <span className="text-[10px] bg-primary-50 text-primary-600 font-bold px-1.5 py-0.5 rounded-full">Default</span>}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-secondary-700">{a.address}</p>
                <p className="text-sm font-semibold text-secondary-600">{a.postcode}</p>
                <div className="flex gap-2 mt-4 pt-3 border-t border-secondary-50">
                  <button onClick={() => openEdit(a)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  {!a.is_default && (
                    <button onClick={() => handleSetDefault(a.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors">
                      <Star className="w-3 h-3" /> Set Default
                    </button>
                  )}
                  <button onClick={() => handleDelete(a.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors ml-auto">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-lg text-secondary-800">{modal === 'add' ? 'Add Address' : 'Edit Address'}</h2>
              <button onClick={() => setModal(null)} className="text-secondary-400 hover:text-secondary-600"><X className="w-5 h-5" /></button>
            </div>
            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700"><AlertCircle className="w-4 h-4" />{error}</div>}
            <div className="space-y-4">
              {[
                { label: 'Label', key: 'label', placeholder: 'e.g. Home, Office' },
                { label: 'Address', key: 'address', placeholder: '123 High Street, London' },
                { label: 'Postcode', key: 'postcode', placeholder: 'SW1A 1AA' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 mb-1.5">{label}</label>
                  <input value={form[key as keyof typeof form]} onChange={(e) => setForm((v) => ({ ...v, [key]: e.target.value }))} placeholder={placeholder}
                    className="w-full h-10 px-3.5 rounded-xl border border-secondary-200 text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-secondary-200 text-sm text-secondary-600 hover:bg-secondary-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 disabled:opacity-60">
                <Check className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
