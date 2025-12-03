/**
 * Bucket Configuration Checker
 * 
 * Run this script to verify your Supabase storage buckets are configured correctly.
 * 
 * Usage: node check-buckets.js
 */

import { supabaseAdmin } from './config/supabase.js';

const REQUIRED_BUCKETS = {
  profile_pictures: {
    public: true,
    fileSizeLimit: 2097152, // 2MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  },
  posts_picture: {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  }
};

async function checkBucketConfiguration() {
  console.log('🔍 Checking Supabase Storage Bucket Configuration...\n');
  
  try {
    // List all buckets
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }

    console.log(`📦 Found ${buckets.length} bucket(s):\n`);

    let allConfigured = true;

    // Check each required bucket
    for (const [bucketName, requiredConfig] of Object.entries(REQUIRED_BUCKETS)) {
      const bucket = buckets.find(b => b.name === bucketName);
      
      console.log(`\n--- Checking ${bucketName} ---`);
      
      if (!bucket) {
        console.log(`❌ MISSING: Bucket "${bucketName}" does not exist`);
        console.log(`   ⚠️  Create it in Supabase Dashboard > Storage > New Bucket`);
        allConfigured = false;
        continue;
      }

      // Check public status
      if (bucket.public !== requiredConfig.public) {
        console.log(`⚠️  Public: ${bucket.public} (should be ${requiredConfig.public})`);
        allConfigured = false;
      } else {
        console.log(`✅ Public: ${bucket.public}`);
      }

      // Check file size limit
      if (bucket.file_size_limit !== requiredConfig.fileSizeLimit) {
        const currentMB = bucket.file_size_limit ? (bucket.file_size_limit / 1048576).toFixed(1) : 'unlimited';
        const requiredMB = (requiredConfig.fileSizeLimit / 1048576).toFixed(1);
        console.log(`⚠️  File Size Limit: ${currentMB}MB (should be ${requiredMB}MB)`);
        allConfigured = false;
      } else {
        const mb = (bucket.file_size_limit / 1048576).toFixed(1);
        console.log(`✅ File Size Limit: ${mb}MB`);
      }

      // Check allowed MIME types
      const allowedMimes = bucket.allowed_mime_types || [];
      const missingMimes = requiredConfig.allowedMimeTypes.filter(m => !allowedMimes.includes(m));
      const extraMimes = allowedMimes.filter(m => !requiredConfig.allowedMimeTypes.includes(m));
      
      if (missingMimes.length > 0 || (extraMimes.length > 0 && allowedMimes.length !== 0)) {
        console.log(`⚠️  Allowed MIME Types:`);
        console.log(`   Current: ${allowedMimes.length > 0 ? allowedMimes.join(', ') : 'all types allowed'}`);
        console.log(`   Required: ${requiredConfig.allowedMimeTypes.join(', ')}`);
        if (missingMimes.length > 0) {
          console.log(`   Missing: ${missingMimes.join(', ')}`);
        }
        allConfigured = false;
      } else {
        console.log(`✅ Allowed MIME Types: ${requiredConfig.allowedMimeTypes.length} type(s) configured`);
      }

      // Test if we can get public URL (indicates bucket is accessible)
      try {
        const { data: urlData } = supabaseAdmin.storage
          .from(bucketName)
          .getPublicUrl('test/test.jpg');
        
        if (urlData?.publicUrl) {
          console.log(`✅ Public URL Pattern: ${urlData.publicUrl.split('/test/')[0]}/.../`);
        }
      } catch (urlError) {
        console.log(`⚠️  Could not generate public URL: ${urlError.message}`);
      }
    }

    console.log('\n\n' + '='.repeat(60));
    
    if (allConfigured) {
      console.log('✅ ALL BUCKETS CONFIGURED CORRECTLY!');
      console.log('\n✨ Your storage buckets are ready to use.');
    } else {
      console.log('⚠️  SOME CONFIGURATIONS NEED ATTENTION');
      console.log('\n📖 See SUPABASE_BUCKETS.md for setup instructions.');
      console.log('🔧 Fix issues in Supabase Dashboard > Storage > [Bucket] > Configuration');
    }
    
    console.log('='.repeat(60) + '\n');

    // Check RLS policies
    console.log('\n📋 Checking RLS Policies...\n');
    console.log('⚠️  RLS policies cannot be checked programmatically.');
    console.log('   Please verify manually in Supabase Dashboard > Storage > [Bucket] > Policies');
    console.log('\n   Required policies for each bucket:');
    console.log('   1. INSERT - Allow authenticated users to upload');
    console.log('   2. UPDATE - Allow users to update their own files');
    console.log('   3. SELECT - Allow public to read files');
    console.log('   4. DELETE - Allow users to delete their own files');
    console.log('\n   See SUPABASE_BUCKETS.md for exact policy SQL.\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the check
checkBucketConfiguration();
