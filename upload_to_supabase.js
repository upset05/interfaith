/**
 * IPPAD — Upload All Local Images to Supabase Cloud Storage
 * 
 * This script:
 *   1. Creates a public 'images' storage bucket (if it doesn't exist)
 *   2. Uploads every WhatsApp *.jpeg from this folder to that bucket
 *   3. Inserts each image's public URL into the 'gallery' database table
 * 
 * Run:  node upload_to_supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// --- Your Supabase credentials (same as in script.js) ---
const SUPABASE_URL = "https://jdgzxvwgvmssayobbdrz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3p4dndndm1zc2F5b2JiZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTMxMDgsImV4cCI6MjA5NDU4OTEwOH0.2OydMDLfRXz5dT0lrHwk4SVOPJom4wC86FCXDJ5FLzQ";

const BUCKET_NAME = 'images';
const PROJECT_DIR = __dirname;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log('=== IPPAD Supabase Image Uploader ===\n');

  // --- Step 1: Create the storage bucket if it doesn't exist ---
  console.log('Step 1: Ensuring storage bucket exists...');
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  
  if (listErr) {
    console.error('ERROR listing buckets:', listErr.message);
    console.log('\n⚠️  If you get a permissions error, you need to create the bucket manually:');
    console.log('   1. Go to https://supabase.com/dashboard → your project → Storage');
    console.log('   2. Click "New bucket"');
    console.log('   3. Name it: images');
    console.log('   4. Toggle "Public bucket" ON');
    console.log('   5. Click "Create bucket"');
    console.log('   6. Then re-run this script.\n');
    // Continue anyway — the bucket might already exist
  } else {
    const bucketExists = buckets && buckets.some(b => b.name === BUCKET_NAME);
    if (!bucketExists) {
      console.log(`   Bucket "${BUCKET_NAME}" not found. Creating it...`);
      const { error: createErr } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760, // 10MB max per file
      });
      if (createErr) {
        console.error('   ERROR creating bucket:', createErr.message);
        console.log('   → Please create it manually in the Supabase Dashboard (Storage → New bucket → "images" → Public ON)');
        console.log('   → Then re-run this script.\n');
      } else {
        console.log(`   ✅ Bucket "${BUCKET_NAME}" created successfully!\n`);
      }
    } else {
      console.log(`   ✅ Bucket "${BUCKET_NAME}" already exists.\n`);
    }
  }

  // --- Step 2: Find all WhatsApp images in the project folder ---
  console.log('Step 2: Scanning for images...');
  const allFiles = fs.readdirSync(PROJECT_DIR);
  const imageFiles = allFiles.filter(f => 
    f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg')
  );
  console.log(`   Found ${imageFiles.length} image files.\n`);

  if (imageFiles.length === 0) {
    console.log('No images to upload. Done.');
    return;
  }

  // --- Step 3: Upload each image to Supabase Storage ---
  console.log('Step 3: Uploading images to Supabase Storage...');
  const uploadedUrls = [];
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const filename = imageFiles[i];
    // Sanitize filename for cloud storage (replace spaces/special chars)
    const safeName = filename
      .replace(/\s+/g, '_')
      .replace(/[()]/g, '')
      .replace(/__+/g, '_');

    const filePath = path.join(PROJECT_DIR, filename);
    const fileBuffer = fs.readFileSync(filePath);

    process.stdout.write(`   [${i + 1}/${imageFiles.length}] ${filename} ... `);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(safeName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,  // overwrite if exists
      });

    if (error) {
      console.log(`❌ ${error.message}`);
      failCount++;
    } else {
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(safeName);

      const publicUrl = urlData.publicUrl;
      uploadedUrls.push({ filename, safeName, publicUrl });
      successCount++;
      console.log(`✅`);
    }
  }

  console.log(`\n   Upload complete: ${successCount} uploaded, ${skipCount} skipped, ${failCount} failed.\n`);

  // --- Step 4: Seed the gallery database table ---
  if (uploadedUrls.length > 0) {
    console.log('Step 4: Seeding gallery database table...');
    
    // First clear existing gallery entries to avoid duplicates
    const { error: deleteErr } = await supabase.from('gallery').delete().neq('id', '');
    if (deleteErr) {
      console.log(`   ⚠️  Could not clear old gallery entries: ${deleteErr.message}`);
    } else {
      console.log('   Cleared old gallery entries.');
    }

    // Insert all uploaded images into gallery table
    const galleryRows = uploadedUrls.map((item, idx) => ({
      id: `gallery_${idx + 1}`,
      image_url: item.publicUrl,
    }));

    // Insert in batches of 50 to avoid request size limits
    const BATCH_SIZE = 50;
    let insertedCount = 0;

    for (let i = 0; i < galleryRows.length; i += BATCH_SIZE) {
      const batch = galleryRows.slice(i, i + BATCH_SIZE);
      const { error: insertErr } = await supabase.from('gallery').insert(batch);
      if (insertErr) {
        console.log(`   ❌ Batch insert error: ${insertErr.message}`);
      } else {
        insertedCount += batch.length;
        console.log(`   ✅ Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} rows)`);
      }
    }

    console.log(`   Total gallery rows inserted: ${insertedCount}\n`);
  }

  // --- Step 5: Generate a filename mapping for script.js reference ---
  console.log('Step 5: Saving URL mapping...');
  const mappingFile = path.join(PROJECT_DIR, 'supabase_image_urls.json');
  fs.writeFileSync(mappingFile, JSON.stringify(uploadedUrls, null, 2));
  console.log(`   ✅ Saved mapping to supabase_image_urls.json\n`);

  // --- Summary ---
  console.log('=== DONE ===');
  console.log(`${successCount} images are now in Supabase Cloud Storage.`);
  console.log(`${uploadedUrls.length} entries seeded in the gallery database table.`);
  console.log('\nYour website will now load images from Supabase automatically!');
  console.log('The local files in your Git repo can be removed once you confirm everything works.');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
