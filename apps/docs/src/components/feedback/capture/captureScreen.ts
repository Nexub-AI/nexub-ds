import { compressIfTooLarge } from './compressIfTooLarge';

const MAX_BYTES = 2_000_000;

/**
 * Capture a single frame from the OS-level screen-share picker.
 *
 * Browser shows the standard "Choose what to share" dialog; user picks a tab,
 * window, or screen; we grab one frame, draw to canvas, stop the track,
 * return the resulting PNG Blob.
 *
 * Resolves `null` if the user cancels the picker. Throws on unsupported
 * browsers — caller should feature-detect via isScreenCaptureSupported() and
 * hide the trigger button instead of catching this error blind.
 */
export async function captureScreen(): Promise<Blob | null> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('screen_capture_unsupported');
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'browser' },
      audio: false,
    });
  } catch (err) {
    // NotAllowedError = user dismissed the picker. Signal cancellation.
    if (err instanceof DOMException && err.name === 'NotAllowedError') return null;
    throw err;
  }

  const track = stream.getVideoTracks()[0];
  if (!track) {
    stream.getTracks().forEach((t) => t.stop());
    throw new Error('screen_capture_no_track');
  }

  try {
    const settings = track.getSettings();
    const width = settings.width ?? 1280;
    const height = settings.height ?? 720;

    // Spin up a hidden <video> element to receive the stream.
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.srcObject = stream;
    await video.play();

    // One rAF gives the video element time to actually paint a frame.
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas_ctx_unavailable');
    ctx.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png'),
    );
    if (!blob) throw new Error('screen_capture_blob_failed');
    return await compressIfTooLarge(blob, MAX_BYTES);
  } finally {
    track.stop();
  }
}
