import { compressIfTooLarge } from './compressIfTooLarge';

const MAX_BYTES = 2_000_000;

/**
 * Capture the current viewport's DOM as a PNG Blob using `html-to-image`.
 *
 * The library is dynamically imported so its ~100 KB only lands in the bundle
 * the first time a user clicks "Capture page". Subsequent clicks reuse the
 * cached chunk.
 *
 * The open feedback Dialog is hidden for one animation frame so the resulting
 * screenshot shows the page as the user was looking at it, not the form on top.
 *
 * Honours `data-feedback-ignore` on any descendant — those nodes are skipped.
 */
export async function capturePage(): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('capturePage_not_in_browser');
  }

  const dialogEl = document.querySelector<HTMLElement>('[role="dialog"]');
  const previousOpacity = dialogEl?.style.opacity ?? '';
  const previousPointerEvents = dialogEl?.style.pointerEvents ?? '';

  if (dialogEl) {
    dialogEl.style.opacity = '0';
    dialogEl.style.pointerEvents = 'none';
  }

  // Wait one rAF so the style change actually paints before we capture.
  await new Promise<void>((r) => requestAnimationFrame(() => r()));

  try {
    const { toBlob } = await import('html-to-image');
    const blob = await toBlob(document.body, {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      cacheBust: true,
      // Cross-origin images without CORS headers (e.g. Avatar examples) can't be
      // inlined; draw a transparent pixel instead of failing the whole capture.
      imagePlaceholder:
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      filter: (node: HTMLElement) =>
        !(typeof node.closest === 'function' && node.closest('[data-feedback-ignore]')),
    });
    if (!blob) throw new Error('capture_returned_null');
    return await compressIfTooLarge(blob, MAX_BYTES);
  } finally {
    if (dialogEl) {
      dialogEl.style.opacity = previousOpacity;
      dialogEl.style.pointerEvents = previousPointerEvents;
    }
  }
}
