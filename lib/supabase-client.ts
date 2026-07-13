import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  _client = createClient(url, key);
  return _client;
}

// Proxy so the module can be imported at the top level without throwing
// during Next.js static analysis (env vars aren't available at module-eval time).
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) { return Reflect.get(getSupabase(), prop); },
});
