import { Text } from '@nexub/react';

export function DocsFooter() {
  return (
    <footer className="border-t border-[var(--color-outline-variant)] px-6 py-6 text-center">
      <Text size="caption" tone="muted">
        Built with the Nexub Design System · © {new Date().getFullYear()} Nexub Pte. Ltd., Singapore ·{' '}
        <a
          href="https://github.com/Nexub-AI/nexub-ds"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--color-primary)] no-underline hover:underline"
        >
          GitHub
        </a>
      </Text>
    </footer>
  );
}
