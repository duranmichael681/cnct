import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/groups/user/:userId
 * Get all groups for a specific user
 */
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabaseAdmin
            .from('user_groups')
            .select(`
                group_id,
                role,
                joined_at,
                groups (
                    id,
                    name,
                    description,
                    created_at
                )
            `)
            .eq('user_id', userId)
            .order('joined_at', { ascending: false });

        if (error) throw error;

        // Flatten the response to return group details
        const groups = data.map(ug => ({
            id: ug.groups.id,
            name: ug.groups.name,
            description: ug.groups.description,
            role: ug.role,
            joined_at: ug.joined_at,
            created_at: ug.groups.created_at
        }));

        res.json({ success: true, data: groups });
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/groups
 * Create a new group and add the creator as a member
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, error: 'Group name is required' });
        }

        // Create the group
        const { data: group, error: groupError } = await supabaseAdmin
            .from('groups')
            .insert({
                name: name.trim(),
                description: description || null,
                created_by: userId
            })
            .select()
            .single();

        if (groupError) throw groupError;

        // Add the creator to the group as an admin
        const { error: memberError } = await supabaseAdmin
            .from('user_groups')
            .insert({
                user_id: userId,
                group_id: group.id,
                role: 'admin'
            });

        if (memberError) throw memberError;

        res.json({ success: true, data: group });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/groups/:groupId
 * Remove user from a group (or delete group if admin and no other members)
 */
router.delete('/:groupId', authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        // Check if user is a member of this group
        const { data: membership, error: memberError } = await supabaseAdmin
            .from('user_groups')
            .select('role')
            .eq('user_id', userId)
            .eq('group_id', groupId)
            .single();

        if (memberError || !membership) {
            return res.status(404).json({ success: false, error: 'Not a member of this group' });
        }

        // Remove the user from the group
        const { error: deleteError } = await supabaseAdmin
            .from('user_groups')
            .delete()
            .eq('user_id', userId)
            .eq('group_id', groupId);

        if (deleteError) throw deleteError;

        // If user was admin, check if group has no more members and delete the group
        if (membership.role === 'admin') {
            const { data: remainingMembers } = await supabaseAdmin
                .from('user_groups')
                .select('user_id')
                .eq('group_id', groupId);

            if (!remainingMembers || remainingMembers.length === 0) {
                await supabaseAdmin
                    .from('groups')
                    .delete()
                    .eq('id', groupId);
            }
        }

        res.json({ success: true, message: 'Removed from group successfully' });
    } catch (error) {
        console.error('Error removing from group:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PUT /api/groups/:groupId
 * Update group details (name, description)
 */
router.put('/:groupId', authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, description } = req.body;
        const userId = req.user.id;

        // Check if user is admin of this group
        const { data: membership, error: memberError } = await supabaseAdmin
            .from('user_groups')
            .select('role')
            .eq('user_id', userId)
            .eq('group_id', groupId)
            .single();

        if (memberError || !membership) {
            return res.status(404).json({ success: false, error: 'Not a member of this group' });
        }

        if (membership.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Only admins can edit group details' });
        }

        // Update the group
        const { data: updatedGroup, error: updateError } = await supabaseAdmin
            .from('groups')
            .update({
                name: name?.trim(),
                description: description || null
            })
            .eq('id', groupId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({ success: true, data: updatedGroup });
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
