import { DocsHeader } from '@/components/layout/DocsHeader';
import { DocsSidebar } from '@/components/layout/DocsSidebar';
import { DocsFooter } from '@/components/layout/DocsFooter';
import { VersionBadge } from '@/components/docs/VersionBadge';
import { SkipToContent } from '@/components/layout/SkipToContent';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Skip navigation for keyboard/screen-reader users */}
      <SkipToContent />
      <DocsHeader versionBadge={<VersionBadge />} />
      <div style={{ display: 'flex', flex: 1 }}>
        <DocsSidebar />
        <main
          id="main-content"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '2.5rem 3rem',
            maxWidth: 'calc(var(--docs-content-max-width) + 6rem)',
          }}
        >
          {children}
        </main>
      </div>
      <DocsFooter />
    </div>
  );
}
