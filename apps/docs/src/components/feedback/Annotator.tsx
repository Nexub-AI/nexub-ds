'use client';

import * as React from 'react';
import { Button } from '@nexub/react';

interface Props {
  source: Blob;
  /** Called when the user clicks "Done" — the flattened image (with strokes
   *  baked in) replaces the current screenshot. */
  onFlatten: (flattened: Blob) => void;
  /** Called when the user clicks "Discard" — clears the screenshot entirely. */
  onDiscard: () => void;
}

const STROKE = '#ef4444';
const LINE_WIDTH = 4;
const PREVIEW_MAX_WIDTH = 480;
const PREVIEW_MAX_HEIGHT = 320;

export function Annotator({ source, onFlatten, onDiscard }: Props) {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [imageDims, setImageDims] = React.useState<{ w: number; h: number } | null>(null);
  const [previewDims, setPreviewDims] = React.useState<{ w: number; h: number } | null>(null);
  const [hasStrokes, setHasStrokes] = React.useState(false);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawingRef = React.useRef(false);
  const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);

  // Load source blob, measure original size, derive a preview-fit display size.
  React.useEffect(() => {
    const url = URL.createObjectURL(source);
    setImageUrl(url);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setImageDims({ w, h });
      const scale = Math.min(PREVIEW_MAX_WIDTH / w, PREVIEW_MAX_HEIGHT / h, 1);
      setPreviewDims({ w: Math.round(w * scale), h: Math.round(h * scale) });
    };
    img.src = url;
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [source]);

  // (Re-)init the canvas whenever preview dims change.
  React.useEffect(() => {
    if (!previewDims || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = previewDims.w;
    canvas.height = previewDims.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = LINE_WIDTH;
  }, [previewDims]);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = getPoint(e);
    // Drop a dot for single-click marks
    const ctx = canvasRef.current?.getContext('2d');
    const p = lastPointRef.current;
    if (ctx && p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, LINE_WIDTH / 2, 0, Math.PI * 2);
      ctx.fillStyle = STROKE;
      ctx.fill();
    }
    setHasStrokes(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    const last = lastPointRef.current;
    const next = getPoint(e);
    if (!ctx || !last) return;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    lastPointRef.current = next;
  };

  const stop = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    lastPointRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const clearStrokes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const handleDone = async () => {
    if (!imageDims || !previewDims) return;
    // Flatten at the FULL source resolution so we don't degrade the screenshot.
    // The annotation strokes live in a preview-sized canvas; scale them up to
    // match the source dimensions when compositing.
    const flat = document.createElement('canvas');
    flat.width = imageDims.w;
    flat.height = imageDims.h;
    const ctx = flat.getContext('2d');
    if (!ctx) return;

    const sourceImg = new Image();
    await new Promise<void>((resolve, reject) => {
      sourceImg.onload = () => resolve();
      sourceImg.onerror = () => reject(new Error('image_load_failed'));
      sourceImg.src = imageUrl ?? '';
    });
    ctx.drawImage(sourceImg, 0, 0, imageDims.w, imageDims.h);

    if (canvasRef.current) {
      ctx.drawImage(canvasRef.current, 0, 0, imageDims.w, imageDims.h);
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      flat.toBlob(resolve, 'image/png'),
    );
    if (blob) onFlatten(blob);
  };

  if (!imageUrl || !previewDims) {
    return (
      <div className="text-label-sm text-[var(--color-on-surface-muted)]">
        Loading capture…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative max-w-full touch-none overflow-hidden rounded-shape-field border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]"
        style={{ width: previewDims.w, height: previewDims.h }}
      >
        <img
          src={imageUrl}
          alt="Captured screenshot"
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill"
        />
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Click and drag to mark the area you're reporting. Stroke colour is red."
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stop}
          onPointerCancel={stop}
          onPointerLeave={stop}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
        />
      </div>

      <div
        className="flex items-center justify-between gap-2 text-label-sm text-[var(--color-on-surface-muted)]"
      >
        <span>Click and drag to mark the area. Strokes save with the screenshot.</span>
        <div className="flex gap-1.5">
          {hasStrokes && (
            <Button type="button" size="xs" variant="text" onClick={clearStrokes}>
              Clear marks
            </Button>
          )}
          <Button type="button" size="xs" variant="outlined" onClick={onDiscard}>
            Discard
          </Button>
          <Button
            type="button"
            size="xs"
            onClick={handleDone}
            disabled={!hasStrokes}
            title={hasStrokes ? 'Bake annotations into the screenshot' : 'Draw something to enable'}
          >
            Save annotations
          </Button>
        </div>
      </div>
    </div>
  );
}
