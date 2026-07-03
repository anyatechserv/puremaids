'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCustomer } from '@/lib/customer-auth';
import { supabase } from '@/lib/supabase';
import { Gift, Copy, Check, Users, ExternalLink } from 'lucide-react';

interface Referral { id: string; code: string; uses: number; created_at: string; }

function generateCode(uid: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'PM-';
  for (let i = 0; i < 6; i++) {
    const idx = parseInt(uid.replace(/-/g, '').slice(i * 2, i * 2 + 2), 16) % chars.length;
    code += chars[idx];
  }
  return code;
}

export default function AccountReferPage() {
  const { user, profile } = useCustomer();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('referrals').select('*').eq('referrer_id', user.id).maybeSingle();
    if (data) {
      setReferral(data as Referral);
    } else {
      const code = generateCode(user.id);
      const { data: created, error } = await supabase
        .from('referrals')
        .insert({ referrer_id: user.id, code, uses: 0 })
        .select('*').single();
      if (!error && created) setReferral(created as Referral);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const referralUrl = typeof window !== 'undefined' && referral
    ? `${window.location.origin}/book-online?ref=${referral.code}`
    : '';

  const handleCopyLink = async () => {
    if (!referralUrl) return;
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCode = async () => {
    if (!referral) return;
    await navigator.clipboard.writeText(referral.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareViaWhatsApp = () => {
    const msg = encodeURIComponent(`Hey! I've been using PureMaids for cleaning and love it. Use my referral link to book: ${referralUrl}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Try PureMaids — 5% off your first clean');
    const body = encodeURIComponent(`Hi,\n\nI've been using PureMaids for my home cleaning and they're brilliant. Use my referral link to get a discount on your first booking:\n\n${referralUrl}\n\nCode: ${referral?.code}\n\nCheers,\n${profile?.full_name || 'A happy customer'}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-secondary-800 mb-1">Refer a Friend</h1>
      <p className="text-secondary-400 text-sm mb-7">Share PureMaids and earn rewards when friends book.</p>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', title: 'Share your link', desc: 'Send your unique referral link to friends and family.' },
          { step: '2', title: 'They book a clean', desc: 'Your friend completes their first booking using your code.' },
          { step: '3', title: 'You both save', desc: 'You get a reward and your friend gets 5% off their first clean.' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-soft text-center">
            <div className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center font-heading font-black text-lg mx-auto mb-3">{step}</div>
            <p className="font-semibold text-secondary-800 mb-1">{title}</p>
            <p className="text-xs text-secondary-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {loading
        ? <div className="h-48 bg-white rounded-2xl border border-secondary-100 animate-pulse" />
        : referral && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-soft text-center">
                <Users className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                <p className="font-heading font-extrabold text-3xl text-primary-600">{referral.uses}</p>
                <p className="text-xs text-secondary-400 font-medium">Friends Referred</p>
              </div>
              <div className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-soft text-center">
                <Gift className="w-5 h-5 text-accent-500 mx-auto mb-2" />
                <p className="font-heading font-extrabold text-3xl text-accent-500">{referral.uses * 5}</p>
                <p className="text-xs text-secondary-400 font-medium">Reward Points Earned</p>
              </div>
            </div>

            {/* Code + link */}
            <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft p-6 mb-6">
              <h2 className="font-heading font-bold text-secondary-800 mb-5">Your Referral Code</h2>

              <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-2xl px-5 py-4 mb-4">
                <span className="font-mono font-black text-2xl tracking-widest text-primary-600 flex-1">{referral.code}</span>
                <button onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white rounded-xl text-xs font-semibold hover:bg-primary-600 transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <div className="mb-5">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-400 block mb-1.5">Referral Link</label>
                <div className="flex items-center gap-2">
                  <input readOnly value={referralUrl}
                    className="flex-1 h-10 px-3.5 rounded-xl border border-secondary-200 bg-secondary-50 text-xs text-secondary-600 focus:outline-none" />
                  <button onClick={handleCopyLink}
                    className="h-10 px-4 rounded-xl border border-secondary-200 text-sm text-secondary-600 hover:bg-secondary-50 transition-colors flex items-center gap-1.5">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-400 block mb-2">Share via</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={shareViaWhatsApp}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </button>
                  <button onClick={shareViaEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary-700 hover:bg-secondary-800 text-white text-sm font-semibold rounded-xl transition-colors">
                    <ExternalLink className="w-4 h-4" /> Email
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 text-sm text-primary-800">
              <p className="font-bold mb-1">Terms</p>
              <p className="text-primary-700 leading-relaxed text-xs">
                Your friend receives 5% off their first booking when they use your referral code. You earn reward points redeemable on future bookings. Referral rewards are applied after your friend&apos;s first clean is completed. Contact us for details.
              </p>
            </div>
          </>
        )}
    </div>
  );
}
