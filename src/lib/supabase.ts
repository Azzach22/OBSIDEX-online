import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const configured = Boolean(url && anon && !url.includes('YOUR_PROJECT'));
export const supabase = configured ? createClient(url!, anon!) : null;
