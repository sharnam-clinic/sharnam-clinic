import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yvskrwkrihgmgphtnrow.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase Anon/Publishable Key is missing in client/.env!\n' +
    'Please add VITE_SUPABASE_ANON_KEY=your_key to client/.env and restart "npm run dev".'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'dummy-anon-key-please-set-in-env'
);
