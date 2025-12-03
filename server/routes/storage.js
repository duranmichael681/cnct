import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// Max upload size (5MB)
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * GET /api/storage/buckets
 * List available storage buckets (admin)
 */
router.get('/buckets', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin.storage.listBuckets();
        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error listing buckets:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/storage/upload
 * Upload a file to Supabase storage
 * Body: { file (base64), bucket, fileName, contentType }
 */
router.post('/upload', async (req, res) => {
    try {
        const { file, bucket, fileName, contentType } = req.body;

        if (!file || !bucket || !fileName) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: file, bucket, fileName'
            });
        }

        /* */
        // Handle both raw base64 and data URLs like "data:image/png;base64,AAAA..."
        const base64Data = file.includes('base64,')
            ? file.split('base64,')[1]
            : file;

        // Estimate file size from base64
        const fileSizeInBytes = Buffer.byteLength(base64Data, 'base64');

        if (fileSizeInBytes > MAX_FILE_SIZE_BYTES) {
            return res.status(400).json({
                success: false,
                error: `Image too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`,
                maxSizeBytes: MAX_FILE_SIZE_BYTES,
            });
        }
        /* */

        // Verify bucket exists first (clearer errors than storage SDK default)
        const { data: buckets, error: listErr } = await supabaseAdmin.storage.listBuckets();
        if (listErr) throw listErr;
        const exists = (buckets || []).some((b) => b.name === bucket);
        if (!exists) {
            return res.status(400).json({
                success: false,
                error: `Bucket not found: ${bucket}. Available buckets: ${(buckets || []).map(b => b.name).join(', ')}`,
            });
        }

        // Decode base64 file
        const buffer = Buffer.from(file, 'base64');

        const { data, error } = await supabaseAdmin.storage
            .from(bucket)
            .upload(fileName, buffer, {
                contentType: contentType || 'application/octet-stream',
                cacheControl: '3600',
                upsert: false,
            });

        if (error) throw error;

        // Get public URL - Supabase automatically generates this
        const { data: urlData } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(data.path);

        console.log('📤 File uploaded successfully:');
        console.log('   Path:', data.path);
        console.log('   Public URL:', urlData.publicUrl);

        res.json({
            success: true,
            data: {
                path: data.path,
                url: urlData.publicUrl,
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/storage/delete
 * Delete a file from Supabase storage
 * Body: { bucket, filePath }
 */
router.delete('/delete', async (req, res) => {
    try {
        const { bucket, filePath } = req.body;

        if (!bucket || !filePath) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: bucket, filePath'
            });
        }

        const { error } = await supabaseAdmin.storage
            .from(bucket)
            .remove([filePath]);

        if (error) throw error;

        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/storage/url/:bucket/:path
 * Get public URL for a file
 */
router.get('/url/:bucket/:path', (req, res) => {
    try {
        const { bucket, path } = req.params;

        const { data } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(path);

        res.json({ success: true, url: data.publicUrl });
    } catch (error) {
        console.error('Error getting file URL:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
