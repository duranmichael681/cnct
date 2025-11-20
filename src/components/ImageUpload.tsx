import { useState, useRef } from 'react';
import { uploadImage, STORAGE_BUCKETS } from '../services/storage';

interface ImageUploadProps {
  bucket?: string;
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  maxSizeMB?: number;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  bucket = STORAGE_BUCKETS.EVENT_IMAGES,
  currentImage,
  onImageUploaded,
  maxSizeMB = 5,
  label = 'Upload Image',
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setUploading(true);
      const url = await uploadImage(file, bucket, maxSizeMB);
      onImageUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-[var(--text)]">{label}</label>
      
      <div className="flex items-center gap-4">
        {/* Preview */}
        {preview && (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-[var(--border)]">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!uploading && (
              <button
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Choose Image'}
          </button>
          
          <p className="text-xs text-[var(--text)] opacity-70 mt-2">
            Max size: {maxSizeMB}MB. Formats: JPEG, PNG, GIF, WebP
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-[var(--text)] opacity-70">
          <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <span>Uploading image...</span>
        </div>
      )}
    </div>
  );
}
