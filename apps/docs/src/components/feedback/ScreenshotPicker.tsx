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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
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
        <label
          style={{
            ...buttonBase,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          <UploadIcon size={14} aria-hidden="true" />
          Upload
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            disabled={busy !== null}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        </label>
      </div>
      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
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
      style={{
        ...buttonBase,
        ...(primary
          ? {
              borderColor: 'var(--color-brand-primary-500)',
              color: 'var(--color-brand-primary-500)',
            }
          : null),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled && !busy ? 0.6 : 1,
      }}
    >
      {icon}
      {busy ? 'Capturing…' : label}
    </button>
  );
}

const buttonBase: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 10px',
  fontSize: '0.78rem',
  fontWeight: 500,
  fontFamily: 'inherit',
  background: 'var(--color-bg-default)',
  color: 'var(--color-text-secondary)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 'var(--radius-md)',
  whiteSpace: 'nowrap',
};
