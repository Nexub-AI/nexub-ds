'use client';

import * as React from 'react';
import {
  PreviewToolbar,
  DEFAULT_TOOLBAR_STATE,
  bgImage,
  widthPx,
  type PreviewToolbarState,
} from './PreviewToolbar';

interface ComponentPreviewProps {
  children: React.ReactNode;
  code: string;
  /** Pre-rendered server-side highlighted code block (React element).
   *  When provided, shown in the Code tab instead of raw code. */
  codeSlot?: React.ReactNode;
  /** Optional content for the A11y tab. When omitted, the tab is hidden. */
  a11ySlot?: React.ReactNode;
  minHeight?: string;
  /** Hide the preview-pane toolbar (background/width/dir). Defaults to false. */
  hideToolbar?: boolean;
}

type Tab = 'preview' | 'code' | 'a11y';

export function ComponentPreview({
  children,
  code,
  codeSlot,
  a11ySlot,
  minHeight = '140px',
  hideToolbar = false,
}: ComponentPreviewProps) {
  const [tab, setTab] = React.useState<Tab>('preview');
  const [toolbar, setToolbar] = React.useState<PreviewToolbarState>(DEFAULT_TOOLBAR_STATE);

  const tabs: Tab[] = ['preview', 'code'];
  if (a11ySlot) tabs.push('a11y');

  return (
    <div
      style={{
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        marginBottom: '1.5rem',
      }}
    >
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Component example tabs"
        style={{
          display: 'flex',
          gap: '2px',
          padding: '8px 12px',
          borderBottom: '1px solid var(--color-border-default)',
          background: 'var(--color-bg-subtle)',
        }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            aria-controls={`tabpanel-${t}`}
            id={`tab-${t}`}
            onClick={() => setTab(t)}
            style={{
              padding: '4px 12px',
              minHeight: '44px',
              minWidth: '44px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-family-sans)',
              fontWeight: tab === t ? 600 : 400,
              background: tab === t ? 'var(--color-bg-default)' : 'transparent',
              border: tab === t ? '1px solid var(--color-border-default)' : '1px solid transparent',
              borderRadius: 'var(--radius-md)',
              color: tab === t ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all var(--duration-fast) var(--ease-out)',
            }}
          >
            {t === 'a11y' ? 'A11y' : t}
          </button>
        ))}
      </div>

      {/* Preview pane */}
      {tab === 'preview' && (
        <>
          <div
            role="tabpanel"
            id="tabpanel-preview"
            aria-labelledby="tab-preview"
            dir={toolbar.dir}
            className="docs-preview-pane"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight,
              padding: '2rem',
              background: 'var(--color-bg-default)',
              overflow: 'auto',
              ...bgImage(toolbar.bg),
            }}
          >
            <div
              style={{
                width: widthPx(toolbar.width),
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(toolbar.width !== 'full'
                  ? {
                      border: '1px dashed var(--color-border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      background: 'var(--color-bg-default)',
                    }
                  : null),
              }}
            >
              {children}
            </div>
          </div>
          {!hideToolbar && <PreviewToolbar state={toolbar} onChange={setToolbar} />}
        </>
      )}

      {/* Code pane */}
      {tab === 'code' && (
        <div role="tabpanel" id="tabpanel-code" aria-labelledby="tab-code" style={{ padding: '12px' }}>
          {codeSlot ?? (
            <pre
              style={{
                background: 'var(--docs-code-bg)',
                color: '#e1e4e8',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                overflowX: 'auto',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                fontFamily: 'var(--font-family-mono)',
                margin: 0,
              }}
            >
              <code>{code}</code>
            </pre>
          )}
        </div>
      )}

      {/* A11y pane */}
      {tab === 'a11y' && a11ySlot && (
        <div
          role="tabpanel"
          id="tabpanel-a11y"
          aria-labelledby="tab-a11y"
          style={{ padding: '1.25rem 1.5rem', background: 'var(--color-bg-default)' }}
        >
          {a11ySlot}
        </div>
      )}
    </div>
  );
}
