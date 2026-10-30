'use client';

import * as React from 'react';
import { Camera, Monitor, Upload as UploadIcon } from '@nexub/icons';
import { capturePage, captureScreen, isScreenCaptureSupported } from './capture';
import { Annotator } from './Annotator';

interface Props {
  value: Blob | File | null;
  onChange: (next: Blob | File | null) => void;
  /** Surface a brief error toast — wired by parent. */
  onError?: (message: string) => void;
}

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_BYTES = 2 * 1024 * 1024;

export function ScreenshotPicker({ value, onChange, onError }: Props) {
  const [busy, setBusy] = React.useState<'page' | 'screen' | null>(null);
  const [screenSupported, setScreenSupported] = React.useState(false);

  // Feature-detect on mount so the button doesn't render server-side.
  React.useEffect(() => {
    setScreenSupported(isScreenCaptureSupported());
  }, []);

  const handleCapturePage = async () => {
    if (busy) return;
    setBusy('page');
    try {
      const blob = await capturePage();
      onChange(blob);
    } catch (err) {
      onError?.('Couldn’t capture the page. Try uploading a file instead.');
      console.warn('[feedback] capturePage failed', err);
    } finally {
      setBusy(null);
    }
  };

  const handleCaptureScreen = async () => {
    if (busy) return;
    setBusy('screen');
    try {
      const blob = await captureScreen();
      if (blob) onChange(blob);
      // null = user cancelled the picker — silent, no error
    } catch (err) {
      onError?.('Screen capture failed. Try uploading a file instead.');
      console.warn('[feedback] captureScreen failed', err);
    } finally {
      setBusy(null);
    }
  };

  const handleFile = (file: File | null) => {
    if (!file) {
      onChange(null);
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      onError?.('Use PNG, JPEG, or WebP.');
      return;
    }
    if (file.size > MAX_BYTES) {
      onError?.('Image must be under 2 MB.');
      return;
    }
    onChange(file);
  };

  // Annotation/preview state
  if (value) {
    return (
      <Annotator
        source={value}
        onFlatten={(flattened) => onChange(flattened)}
        onDiscard={() => onChange(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        <CaptureBtn
          icon={<Camera size={14} />}
          label="Capture page"
          onClick={handleCapturePage}
          busy={busy === 'page'}
          disabled={busy !== null}
          primary
        />
        {screenSupported && (
          <CaptureBtn
            icon={<Monitor size={14} />}
            label="Capture screen…"
            onClick={handleCaptureScreen}
            busy={busy === 'screen'}
            disabled={busy !== null}
          />
        )}
        <label className={btnClass + (busy ? ' cursor-not-allowed opacity-60' : ' cursor-pointer')}>
          <UploadIcon size={14} aria-hidden="true" />
          Upload
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            disabled={busy !== null}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            className="pointer-events-none absolute h-px w-px opacity-0"
          />
        </label>
      </div>
      <p className="m-0 text-label-sm text-[var(--color-on-surface-muted)]">
        Capture page = current viewport (no permission). Capture screen = native picker (browser/window/screen). Max 2 MB.
      </p>
    </div>
  );
}

function CaptureBtn({
  icon,
  label,
  onClick,
  busy,
  disabled,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  busy: boolean;
  disabled: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        btnClass +
        (primary ? ' !border-[var(--color-primary)] !text-[var(--color-primary)]' : '') +
        (disabled ? ' cursor-not-allowed' : ' cursor-pointer') +
        (disabled && !busy ? ' opacity-60' : '')
      }
    >
      {icon}
      {busy ? 'Capturing…' : label}
    </button>
  );
}

const btnClass =
  'nx-state-layer relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-shape-control border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3 py-1.5 text-label-md font-medium text-[var(--color-on-surface-variant)]';
