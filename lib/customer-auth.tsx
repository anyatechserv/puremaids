'use client';

import {
  createContext, useContext, useEffect, useState, useCallback, type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface CustomerProfile {
  id: string;
  full_name: string;
  phone: string | null;
}

interface CustomerContextValue {
  user: User | null;
  profile: CustomerProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('customer_profiles')
      .select('id, full_name, phone')
      .eq('user_id', uid)
      .maybeSingle();
    setProfile(data ?? null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (u) await fetchProfile(u.id);
  }, [fetchProfile]);

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    const uid = data.user?.id;
    if (uid) {
      await supabase.from('customer_profiles').insert({ user_id: uid, full_name: fullName });
      // Claim any bookings made with this email before sign-up
      await supabase
        .from('bookings')
        .update({ user_id: uid })
        .eq('email', email)
        .is('user_id', null);
    }
    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <CustomerContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be inside CustomerProvider');
  return ctx;
}
