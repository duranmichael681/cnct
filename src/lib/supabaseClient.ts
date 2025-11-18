import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the current user's auth token for API requests
 */
export async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('🔑 Getting auth token:', {
    hasSession: !!session,
    hasAccessToken: !!session?.access_token,
    user: session?.user?.email
  });
  return session?.access_token || null;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  console.log('👤 Current user:', {
    user: user?.email,
    id: user?.id,
    error: error?.message
  });
  
  return { user, error };
}
