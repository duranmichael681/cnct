import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase environment variables');
}

/**
 * IMPORTANT: SupabaseAdmin Client Configuration
 * 
 * This admin client uses the SERVICE_ROLE_KEY which BYPASSES all Row Level Security (RLS) policies.
 * 
 * Benefits:
 * - Allows the backend to perform operations without user-specific restrictions
 * - Enables administrative operations (user management, bulk updates, etc.)
 * - Allows direct API calls from outside the application (e.g., curl, Postman)
 * - Simplifies backend logic by not requiring authentication for every database operation
 * 
 * Security Considerations:
 * - The SERVICE_ROLE_KEY must NEVER be exposed to the frontend
 * - All data validation and authorization must be handled in application code
 * - RLS policies are still enforced for direct client connections (from frontend)
 * - Consider implementing additional middleware for sensitive operations
 * 
 * Note: While RLS policies have been created for tables (groups, follows, comments, comment_votes),
 * they only apply when using the anon key or user-authenticated connections. When using supabaseAdmin,
 * these policies are bypassed, so authorization logic must be implemented in the route handlers.
 */

// Admin client (bypasses Row Level Security - use with caution)
export const supabaseAdmin = createClient(supabaseUrl, serviceKey);

// Anon client for auth verification (respects RLS policies)
export const supabaseAnon = createClient(supabaseUrl, anonKey);
