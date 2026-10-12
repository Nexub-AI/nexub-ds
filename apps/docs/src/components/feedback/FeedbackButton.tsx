'use client';

import * as React from 'react';
import { MessageSquare } from '@nexub/icons';

// Dialog + Turnstile + screenshot/annotation code loads on first click only.
const FeedbackDialog = React.lazy(() =>
  import('./FeedbackDialog').then((m) => ({ default: m.FeedbackDialog })),
);

/**
 * Floating action pill anchored bottom-right on every docs page. Opens the
 * feedback dialog. Hides itself while the dialog is open so it doesn't sit
 * over the modal scrim.
 */
export function FeedbackButton() {
  const [open, setOpen] = React.useState(false);
  // Stays true after first open so the dialog can animate closed.
  const [loaded, setLoaded] = React.useState(false);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => {
            setLoaded(true);
            setOpen(true);
          }}
          aria-label="Send feedback"
          className="docs-feedback-fab"
          style={{
            position: 'fixed',
            right: 'clamp(12px, 2vw, 24px)',
            bottom: 'clamp(12px, 2vw, 24px)',
            zIndex: 90,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-bg-default)',
            color: 'var(--color-text-primary)',
            fontSize: '0.82rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            boxShadow:
              '0 6px 20px -6px color-mix(in srgb, var(--color-text-primary) 18%, transparent), 0 1px 2px color-mix(in srgb, var(--color-text-primary) 6%, transparent)',
            transition:
              'transform var(--duration-fast, 180ms) var(--ease-out, ease), box-shadow var(--duration-fast, 180ms) var(--ease-out, ease)',
          }}
        >
          <MessageSquare size={15} aria-hidden="true" />
          Feedback
        </button>
      )}

      {loaded && (
        <React.Suspense fallback={null}>
          <FeedbackDialog open={open} onOpenChange={setOpen} />
        </React.Suspense>
      )}
    </>
  );
}
