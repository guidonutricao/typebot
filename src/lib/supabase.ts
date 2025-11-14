import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

// IMPORTANTE: Usar apenas ANON KEY no frontend!
// A service role key NUNCA deve ser exposta no código do cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
