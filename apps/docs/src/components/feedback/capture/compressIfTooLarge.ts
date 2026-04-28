/**
 * Belt-and-braces re-encode if a captured Blob would exceed the server's 2 MB
 * cap. Pixel-ratio-2 viewport captures normally fit, but a 4K monitor with
 * heavy graphics can push beyond. JPEG q:0.85 is a generous middle ground.
 *
 * If the input already fits, returns it untouched (no re-encode → no quality
 * loss for the common case).
 *
 * If the JPEG re-encode is still too large, returns the JPEG anyway and lets
 * the caller surface a "too large" toast from the server response. We don't
 * try harder than one re-encode pass to keep this code obvious.
 */
export async function compressIfTooLarge(blob: Blob, maxBytes: number): Promise<Blob> {
  if (blob.size <= maxBytes) return blob;

  const bitmap = await blobToBitmap(blob);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return blob;
    ctx.drawImage(bitmap, 0, 0);
    const compressed = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85),
    );
    return compressed ?? blob;
  } finally {
    bitmap.close?.();
  }
}

async function blobToBitmap(blob: Blob): Promise<ImageBitmap> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(blob);
  }
  // Fallback for older browsers — load through an <img>.
  return new Promise<ImageBitmap>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Wrap the HTMLImageElement in an ImageBitmap-like shape via canvas.
      // (Most browsers we target ship createImageBitmap, so this is rare.)
      resolve(img as unknown as ImageBitmap);
    };
    img.onerror = () => reject(new Error('compress_load_failed'));
    img.src = URL.createObjectURL(blob);
  });
}
