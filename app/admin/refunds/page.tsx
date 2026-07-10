'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import RefundManager from '@/components/stripe/RefundManager';

export default function AdminRefundsPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      setIsAdmin(!!data);
    }
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <div className="flex min-h-screen items-center justify-center text-gray-500">Checking access...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">You need admin access to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <RefundManager />
      </div>
    </div>
  );
}
