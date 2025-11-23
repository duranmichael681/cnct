import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

/**
 * GET /api/tags
 * Get all available tags
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('tags')
            .select('*')
            .order('code', { ascending: true });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/tags/:id
 * Get a specific tag by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('tags')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching tag:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
