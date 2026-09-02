import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env';

// Server-side Supabase client using Service Role Key for elevated DB privileges inside worker tasks
export const supabaseAdmin: SupabaseClient = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Standard client with Anon Key
export const supabaseClient: SupabaseClient = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
);
