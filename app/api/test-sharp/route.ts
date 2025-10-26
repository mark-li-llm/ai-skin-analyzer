/**
 * POC: Sharp + Vercel Compatibility Test
 *
 * Purpose: Verify sharp works in local macOS environment
 * Related: ADR-005, experiments/adr005-sharp-vercel-verification.md
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    console.log(`📁 File received: ${file.name} (${file.size} bytes, ${file.type})`);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process with sharp
    const processStart = Date.now();

    const processedBuffer = await sharp(buffer)
      .resize(1024, 1024, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    const processTime = Date.now() - processStart;
    console.log(`⚡ Processing completed in ${processTime}ms`);

    // Get metadata
    const metadata = await sharp(processedBuffer).metadata();

    // Convert to base64 (for OpenAI API)
    const base64 = processedBuffer.toString('base64');

    const totalTime = Date.now() - startTime;

    // Return success with metrics
    return NextResponse.json({
      success: true,
      message: 'Sharp is working on macOS! ✅',
      environment: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
      },
      input: {
        filename: file.name,
        sizeBytes: file.size,
        mimeType: file.type,
      },
      output: {
        sizeBytes: processedBuffer.length,
        dimensions: {
          width: metadata.width,
          height: metadata.height,
        },
        format: metadata.format,
        base64Length: base64.length,
        base64Preview: base64.substring(0, 100) + '...',
      },
      performance: {
        processingTimeMs: processTime,
        totalTimeMs: totalTime,
        target: '<500ms',
        passed: processTime < 500,
      }
    });

  } catch (error) {
    console.error('❌ Sharp error:', error);

    return NextResponse.json({
      success: false,
      error: 'Sharp processing failed',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'live',
    endpoint: 'POST /api/test-sharp',
    instructions: 'Send image as multipart/form-data with field name "image"',
    testCommand: 'curl -X POST http://localhost:3000/api/test-sharp -F "image=@experiments/test-images/test1.jpg"'
  });
}
