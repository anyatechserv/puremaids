'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, UserCheck, Phone, Mail, AlertCircle, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Cleaner {
  id: string; full_name: string; email: string | null;
  phone: string | null; is_active: boolean; created_at: string;
}

interface FormData { full_name: string; email: string; phone: string; is_active: boolean; }
const blank: FormData = { full_name: '', email: '', phone: '', is_active: true };

export default function AdminCleanersPage() {
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<null | 'add' | Cleaner>(null);
  const [form, setForm] = useState<FormData>(blank);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: e } = await supabase.from('cleaners').select('*').order('full_name');
    if (e) setError(e.message);
    else setCleaners((data as Cleaner[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(blank); setModal('add'); };
  const openEdit = (c: Cleaner) => {
    setForm({ full_name: c.full_name, email: c.email ?? '', phone: c.phone ?? '', is_active: c.is_active });
    setModal(c);
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) return;
    setSaving(true); setError('');
    if (modal === 'add') {
      const { data, error: e } = await supabase.from('cleaners')
        .insert({ full_name: form.full_name, email: form.email || null, phone: form.phone || null, is_active: form.is_active })
        .select('*').single();
      if (e) { setError(e.message); } else { setCleaners((prev) => ([...prev, data as Cleaner]).sort((a, b) => a.full_name.localeCompare(b.full_name))); }
    } else if (modal !== null && typeof modal !== 'string') {
      const { error: e } = await supabase.from('cleaners')
        .update({ full_name: form.full_name, email: form.email || null, phone: form.phone || null, is_active: form.is_active })
        .eq('id', modal.id);
      if (e) { setError(e.message); } else {
        setCleaners((prev) => prev.map((c) => c.id === modal.id ? { ...c, ...form, email: form.email || null, phone: form.phone || null } : c));
      }
    }
    setSaving(false);
    setModal(null);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    const { error: e } = await supabase.from('cleaners').update({ is_active: false }).eq('id', id);
    if (e) { setError(e.message); } else { setCleaners((prev) => prev.map((c) => c.id === id ? { ...c, is_active: false } : c)); }
    setDeleteId(null);
  };

  const active = cleaners.filter((c) => c.is_active);
  const inactive = cleaners.filter((c) => !c.is_active);

  return (
    <div className="p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-secondary-800">Cleaners</h1>
          <p className="text-secondary-400 text-sm">Manage your cleaning team</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Cleaner
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Total Cleaners', value: cleaners.length, color: 'text-secondary-800' },
          { label: 'Active', value: active.length, color: 'text-green-600' },
          { label: 'Inactive', value: inactive.length, color: 'text-secondary-400' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-soft">
            <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={cn('font-heading font-extrabold text-2xl', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading
        ? <div className="text-center py-16 text-secondary-400">Loading...</div>
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cleaners.map((c) => (
              <div key={c.id} className={cn('bg-white rounded-2xl border p-5 shadow-soft', c.is_active ? 'border-secondary-100' : 'border-secondary-100 opacity-60')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className={cn('text-xs px-2 py-1 rounded-full font-semibold', c.is_active ? 'bg-green-50 text-green-700' : 'bg-secondary-100 text-secondary-500')}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-secondary-800 mb-1">{c.full_name}</h3>
                {c.email && <p className="flex items-center gap-1.5 text-xs text-secondary-500 mb-0.5"><Mail className="w-3 h-3" />{c.email}</p>}
                {c.phone && <p className="flex items-center gap-1.5 text-xs text-secondary-500"><Phone className="w-3 h-3" />{c.phone}</p>}
                <div className="flex gap-2 mt-4 pt-4 border-t border-secondary-50">
                  <button onClick={() => openEdit(c)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  {c.is_active && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deleteId === c.id}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
                    >
                      <Trash2 className="w-3 h-3" /> Deactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-lg text-secondary-800">{modal === 'add' ? 'Add Cleaner' : 'Edit Cleaner'}</h2>
              <button onClick={() => setModal(null)} className="text-secondary-400 hover:text-secondary-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {(['full_name', 'email', 'phone'] as const).map((f) => (
                <div key={f}>
                  <label className="block text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-1.5 capitalize">
                    {f.replace('_', ' ')}{f === 'full_name' && ' *'}
                  </label>
                  <input
                    type={f === 'email' ? 'email' : 'text'}
                    value={form[f]}
                    onChange={(e) => setForm((v) => ({ ...v, [f]: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-secondary-200 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    placeholder={f === 'full_name' ? 'Jane Smith' : f === 'email' ? 'jane@example.com' : '07700 123 456'}
                  />
                </div>
              ))}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div onClick={() => setForm((v) => ({ ...v, is_active: !v.is_active }))} className={cn('w-10 h-5.5 rounded-full flex items-center transition-colors', form.is_active ? 'bg-primary-500' : 'bg-secondary-200')}>
                  <div className={cn('w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5', form.is_active ? 'translate-x-4.5' : 'translate-x-0')} />
                </div>
                <span className="text-sm text-secondary-700 font-medium">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-secondary-200 text-sm text-secondary-600 hover:bg-secondary-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.full_name.trim()} className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">
                <Check className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
