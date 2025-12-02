// Storage Service for Supabase file uploads

import { supabase } from '../lib/supabaseClient';

/**
 * Upload a file to Supabase storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name (e.g., 'event-images', 'profile-pictures')
 * @param path - Optional path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string,
  path?: string
): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Upload an image file with validation
 * @param file - The image file to upload
 * @param bucket - The storage bucket name
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: string,
  maxSizeMB: number = 5
): Promise<string> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
  }

  // Validate file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size must be less than ${maxSizeMB}MB`);
  }

  return uploadFile(file, bucket);
}

/**
 * Delete a file from Supabase storage
 * @param bucket - The storage bucket name
 * @param filePath - The path to the file within the bucket
 */
export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Get the public URL for a file in storage
 * @param bucket - The storage bucket name
 * @param filePath - The path to the file within the bucket
 * @returns The public URL
 */
export function getPublicUrl(bucket: string, filePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Common storage bucket names
 */
export const STORAGE_BUCKETS = {
  EVENT_IMAGES: 'posts_picture',
  PROFILE_PICTURES: 'profile_pictures',
  POST_IMAGES: 'posts_picture',
} as const;
