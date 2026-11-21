'use client';

import * as React from 'react';
import { MessageSquare } from '@nexub/icons';
import { Button } from '@nexub/react';

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
        <Button
          variant="outlined"
          onClick={() => {
            setLoaded(true);
            setOpen(true);
          }}
          aria-label="Send feedback"
          leadingIcon={<MessageSquare size={15} aria-hidden="true" />}
          // Same pill as before: the DS button supplies the shape, state layer and press.
          className="docs-feedback-fab fixed bottom-[clamp(12px,2vw,24px)] end-[clamp(12px,2vw,24px)] z-[90] h-auto bg-surface-elevated px-3.5 py-2.5 font-semibold shadow-elevation-2 transition-[transform,box-shadow] duration-spatial-fast ease-spatial-fast"
        >
          Feedback
        </Button>
      )}

      {loaded && (
        <React.Suspense fallback={null}>
          <FeedbackDialog open={open} onOpenChange={setOpen} />
        </React.Suspense>
      )}
    </>
  );
}
