export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only z-[9999] rounded-shape-field bg-[var(--color-primary)] px-4 py-2 text-label-lg text-[var(--color-on-primary)] no-underline focus:not-sr-only focus:fixed focus:start-2 focus:top-2"
    >
      Skip to content
    </a>
  );
}
