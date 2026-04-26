'use client';

import * as React from 'react';

interface ComponentPreviewProps {
  children: React.ReactNode;
  code: string;
  /** Pre-rendered server-side highlighted code block (React element).
   *  When provided, shown in the Code tab instead of raw code. */
  codeSlot?: React.ReactNode;
  lang?: string;
  minHeight?: string;
}

export function ComponentPreview({
  children,
  code,
  codeSlot,
  lang: _lang = 'tsx',
  minHeight = '140px',
}: ComponentPreviewProps) {
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview');

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
        {(['preview', 'code'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            aria-controls={`tabpanel-${t}`}
            id={`tab-${t}`}
            onClick={() => setTab(t)}
            style={{
              padding: '4px 12px',
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
            {t}
          </button>
        ))}
      </div>

      {/* Preview pane */}
      {tab === 'preview' && (
        <div
          role="tabpanel"
          id="tabpanel-preview"
          aria-labelledby="tab-preview"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight,
            padding: '2rem',
            background: 'var(--color-bg-default)',
            backgroundImage: 'radial-gradient(var(--color-border-default) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {children}
        </div>
      )}

      {/* Code pane */}
      {tab === 'code' && (
        <div role="tabpanel" id="tabpanel-code" aria-labelledby="tab-code" style={{ padding: '12px' }}>
          {codeSlot ?? (
            /* Fallback: raw code in styled pre — no syntax highlighting */
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
    </div>
  );
}
