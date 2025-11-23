import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Create anon client for auth verification
const supabaseAnon = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

/**
 * Auth middleware - extracts and verifies JWT token
 * Attaches user object to req.user if valid
 */
export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        console.log('🔐 Auth Middleware:');
        console.log('  Headers:', Object.keys(req.headers));
        console.log('  Authorization:', authHeader ? 'Present' : 'Missing');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('⚠️  No auth token provided - allowing request without user');
            // Don't block the request, just don't attach user
            req.user = null;
            return next();
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('  Token (first 20 chars):', token.substring(0, 20) + '...');

        // Verify token with Supabase
        const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

        if (error) {
            console.error('❌ Token verification failed:', error.message);
            req.user = null;
            return next();
        }

        if (!user) {
            console.log('⚠️  No user found for token');
            req.user = null;
            return next();
        }

        console.log('✅ User authenticated:', {
            id: user.id,
            email: user.email
        });

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('❌ Auth middleware error:', error);
        req.user = null;
        next();
    }
};
