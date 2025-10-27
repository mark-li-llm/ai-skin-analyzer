#!/usr/bin/env node
/**
 * Verification Script: EXIF Metadata Stripping
 *
 * Purpose: Verify that sharp processing correctly strips EXIF metadata
 * including GPS coordinates, device info, and timestamps.
 *
 * Usage: node scripts/verify-metadata-stripping.js [path-to-test-image]
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration (matches API route)
const IMAGE_MAX_DIMENSION = 1024;
const JPEG_QUALITY = 85;

async function verifyMetadataStripping(inputPath) {
  console.log('🔍 EXIF Metadata Stripping Verification\n');
  console.log(`Input: ${inputPath}\n`);

  try {
    // Read input file
    const inputBuffer = fs.readFileSync(inputPath);

    // Get metadata from original image
    console.log('📋 ORIGINAL IMAGE METADATA:');
    const originalMetadata = await sharp(inputBuffer).metadata();
    console.log('- Format:', originalMetadata.format);
    console.log('- Width:', originalMetadata.width);
    console.log('- Height:', originalMetadata.height);
    console.log('- Orientation:', originalMetadata.orientation || 'none');
    console.log('- Has EXIF:', originalMetadata.exif ? 'YES ⚠️' : 'NO ✅');
    console.log('- Has ICC Profile:', originalMetadata.icc ? 'YES' : 'NO');
    console.log('- Has XMP:', originalMetadata.xmp ? 'YES' : 'NO');
    console.log('- Has IPTC:', originalMetadata.iptc ? 'YES' : 'NO');

    if (originalMetadata.exif) {
      console.log('  EXIF size:', originalMetadata.exif.length, 'bytes');
    }

    console.log('\n🔧 PROCESSING IMAGE (same as API route)...\n');

    // Process exactly like the API route does
    const processedBuffer = await sharp(inputBuffer)
      .rotate()  // Auto-orient based on EXIF
      .resize(IMAGE_MAX_DIMENSION, IMAGE_MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toColorspace('srgb')
      .jpeg({
        quality: JPEG_QUALITY,
        mozjpeg: true
      })
      // NOT calling .withMetadata() - this strips all metadata
      .toBuffer();

    // Get metadata from processed image
    console.log('📋 PROCESSED IMAGE METADATA:');
    const processedMetadata = await sharp(processedBuffer).metadata();
    console.log('- Format:', processedMetadata.format);
    console.log('- Width:', processedMetadata.width);
    console.log('- Height:', processedMetadata.height);
    console.log('- Orientation:', processedMetadata.orientation || 'none');
    console.log('- Has EXIF:', processedMetadata.exif ? 'YES ❌ FAILED' : 'NO ✅');
    console.log('- Has ICC Profile:', processedMetadata.icc ? 'YES' : 'NO');
    console.log('- Has XMP:', processedMetadata.xmp ? 'YES ❌' : 'NO ✅');
    console.log('- Has IPTC:', processedMetadata.iptc ? 'YES ❌' : 'NO ✅');

    if (processedMetadata.exif) {
      console.log('  EXIF size:', processedMetadata.exif.length, 'bytes');
    }

    console.log('\n');
    console.log('━'.repeat(60));
    console.log('📊 VERIFICATION RESULTS:');
    console.log('━'.repeat(60));

    const tests = [
      {
        name: 'EXIF stripped',
        pass: !processedMetadata.exif,
        critical: true
      },
      {
        name: 'XMP stripped',
        pass: !processedMetadata.xmp,
        critical: true
      },
      {
        name: 'IPTC stripped',
        pass: !processedMetadata.iptc,
        critical: true
      },
      {
        name: 'Image auto-oriented',
        pass: !processedMetadata.orientation || processedMetadata.orientation === 1,
        critical: false
      },
      {
        name: 'Converted to sRGB',
        pass: processedMetadata.space === 'srgb',
        critical: true
      },
      {
        name: 'Resized to max 1024px',
        pass: processedMetadata.width <= IMAGE_MAX_DIMENSION &&
              processedMetadata.height <= IMAGE_MAX_DIMENSION,
        critical: true
      },
      {
        name: 'Converted to JPEG',
        pass: processedMetadata.format === 'jpeg',
        critical: true
      }
    ];

    let allCriticalPassed = true;

    tests.forEach(test => {
      const icon = test.pass ? '✅' : '❌';
      const critical = test.critical ? ' [CRITICAL]' : '';
      console.log(`${icon} ${test.name}${critical}`);
      if (test.critical && !test.pass) {
        allCriticalPassed = false;
      }
    });

    console.log('━'.repeat(60));

    if (allCriticalPassed) {
      console.log('\n✅ SUCCESS: All critical security checks passed!');
      console.log('   Metadata (EXIF, XMP, IPTC) has been successfully stripped.');
      console.log('   No GPS coordinates, device info, or timestamps in output.');
      return 0;
    } else {
      console.log('\n❌ FAILURE: Some critical checks failed!');
      console.log('   Review the implementation - metadata may not be stripped.');
      return 1;
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    return 1;
  }
}

// Main
const args = process.argv.slice(2);
const defaultImage = path.join(__dirname, '../experiments/test-images/test1.jpg');
const inputPath = args[0] || defaultImage;

if (!fs.existsSync(inputPath)) {
  console.error(`❌ Error: File not found: ${inputPath}`);
  console.error('\nUsage: node scripts/verify-metadata-stripping.js [path-to-image]');
  console.error(`Example: node scripts/verify-metadata-stripping.js ${defaultImage}`);
  process.exit(1);
}

verifyMetadataStripping(inputPath)
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
