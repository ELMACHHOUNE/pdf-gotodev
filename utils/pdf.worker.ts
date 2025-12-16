/// <reference lib="webworker" />

import { PDFDocument, PDFName, PDFRawStream } from 'pdf-lib';

self.onmessage = async (e: MessageEvent<File>) => {
  try {
    console.log('Worker started compression task (Smart Image Optimization)');
    const file = e.data;
    const arrayBuffer = await file.arrayBuffer();

    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const context = pdfDoc.context;

    // 1. Optimize Images
    // Iterate through all indirect objects to find images
    const indirectObjects = context.enumerateIndirectObjects();
    let optimizedCount = 0;
    let skippedCount = 0;

    for (const [ref, object] of indirectObjects) {
      // Look for Streams that are Images
      if (object instanceof PDFRawStream) {
        const dict = object.dict;
        const subtype = dict.get(PDFName.of('Subtype'));
        const filter = dict.get(PDFName.of('Filter'));

        // We specifically target JPEGs (DCTDecode) for now as they are easiest to resize client-side
        // and usually the source of large file sizes in scanned docs/photos.
        if (subtype === PDFName.of('Image') && filter === PDFName.of('DCTDecode')) {
          try {
            const imageBytes = object.contents;
            
            // Create a bitmap from the raw bytes
            const blob = new Blob([imageBytes as unknown as BlobPart], { type: 'image/jpeg' });
            const bitmap = await createImageBitmap(blob);

            // Check if image is large enough to warrant compression
            // We use a higher threshold (2000px) to preserve detail for printing/viewing
            const MAX_DIM = 2000;
            
            if (bitmap.width > 500 || bitmap.height > 500) {
              let newWidth = bitmap.width;
              let newHeight = bitmap.height;

              // Only resize if it exceeds the max dimension
              if (bitmap.width > MAX_DIM || bitmap.height > MAX_DIM) {
                const scale = Math.min(MAX_DIM / bitmap.width, MAX_DIM / bitmap.height);
                newWidth = Math.round(bitmap.width * scale);
                newHeight = Math.round(bitmap.height * scale);
              }

              // Draw to OffscreenCanvas
              const canvas = new OffscreenCanvas(newWidth, newHeight);
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);
                
                // Compress to high quality JPEG (0.8)
                // PDF does not natively support WebP in standard filters (DCTDecode is JPEG).
                // 0.8 provides a great balance: removes invisible noise but keeps visual sharpness.
                const compressedBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 });
                const compressedBytes = await compressedBlob.arrayBuffer();

                // Only replace if we save significant space (> 10% reduction)
                // This prevents degrading quality for negligible gains
                if (compressedBytes.byteLength < imageBytes.byteLength * 0.9) {
                  // Update the stream contents
                  // We need to create a new stream with the new data but keep other props (mostly)
                  // Actually, we just update the contents and the Width/Height in the dict
                  
                  // Note: We must cast to Uint8Array for pdf-lib
                  (object as any).contents = new Uint8Array(compressedBytes);
                  
                  // Update dimensions in the dictionary
                  dict.set(PDFName.of('Width'), context.obj(newWidth));
                  dict.set(PDFName.of('Height'), context.obj(newHeight));
                  
                  optimizedCount++;
                } else {
                    skippedCount++;
                }
              }
            } else {
                skippedCount++;
            }
            bitmap.close();
          } catch (err) {
            console.warn('Failed to optimize an image:', err);
            skippedCount++;
          }
        }
      }
    }

    console.log(`Optimized ${optimizedCount} images. Skipped ${skippedCount}.`);

    // 2. Standard Cleanup (Metadata, etc.)
    // We save the *original* doc (which we modified in place) instead of copying pages
    // This preserves the structure better when we are just modifying streams
    
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setProducer('Secure PDF Compressor');
    pdfDoc.setCreator('Secure PDF Compressor');

    console.log('Saving new PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });

    self.postMessage({ type: 'success', blob });

  } catch (error) {
    console.error('Worker caught error:', error);
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'string' ? error : JSON.stringify(error));
    self.postMessage({ type: 'error', error: errorMessage });
  }
};
