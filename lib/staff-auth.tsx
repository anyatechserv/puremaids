'use client';

import {
  createContext, useContext, useEffect, useState, useCallback, type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface CleanerProfile {
  id: string;          // cleaner_profiles.id
  cleaner_id: string;  // cleaners.id
  full_name: string;
  email: string | null;
  phone: string | null;
  hourly_rate_pence: number;
}

interface StaffContextValue {
  user: User | null;
  profile: CleanerProfile | null;
  loading: boolean;
  isStaff: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const StaffContext = createContext<StaffContextValue | null>(null);

export function StaffProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CleanerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('cleaner_profiles')
      .select('id, cleaner_id, hourly_rate_pence, cleaners(full_name, email, phone)')
      .eq('user_id', uid)
      .maybeSingle();

    if (data) {
      const c = (Array.isArray(data.cleaners) ? data.cleaners[0] : data.cleaners) as { full_name: string; email: string | null; phone: string | null } | null;
      setProfile({
        id: data.id,
        cleaner_id: data.cleaner_id,
        hourly_rate_pence: data.hourly_rate_pence,
        full_name: c?.full_name ?? '',
        email: c?.email ?? null,
        phone: c?.phone ?? null,
      });
    } else {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        (async () => {
          setUser(session?.user ?? null);
          if (session?.user) await fetchProfile(session.user.id);
          else setProfile(null);
        })();
      },
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (data.user) {
      const { data: cp } = await supabase
        .from('cleaner_profiles')
        .select('id')
        .eq('user_id', data.user.id)
        .maybeSingle();
      if (!cp) {
        await supabase.auth.signOut();
        return 'No staff account found. Contact your manager.';
      }
    }
    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <StaffContext.Provider value={{ user, profile, loading, isStaff: !!profile, signIn, signOut }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error('useStaff must be inside StaffProvider');
  return ctx;
}
