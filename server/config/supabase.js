import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase environment variables');
}

// Admin client (bypasses Row Level Security)
export const supabaseAdmin = createClient(supabaseUrl, serviceKey);

// Anon client for auth verification (respects RLS)
export const supabaseAnon = createClient(supabaseUrl, anonKey);
