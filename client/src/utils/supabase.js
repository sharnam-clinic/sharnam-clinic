import { createClient } from '@supabase/supabase-js';

// Supabase client is used ONLY for file storage uploads (e.g., clinic photos).
// All data CRUD operations go through the Express backend API.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yvskrwkrihgmgphtnrow.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase Anon/Publishable Key is missing in client/.env!\n' +
    'File uploads will not work. Add VITE_SUPABASE_ANON_KEY=your_key to client/.env.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'dummy-anon-key-please-set-in-env'
);
