import { DocsHeader } from '@/components/layout/DocsHeader';
import { DocsSidebar } from '@/components/layout/DocsSidebar';
import { DocsFooter } from '@/components/layout/DocsFooter';
import { DocsOverlay } from '@/components/layout/DocsOverlay';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { VersionBadge } from '@/components/docs/VersionBadge';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { navGroups } from '@/registry/index';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SkipToContent />
        <DocsHeader versionBadge={<VersionBadge />} />
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          <DocsSidebar navGroups={navGroups} />
          {/* Mobile overlay — closes sidebar when tapping outside */}
          <DocsOverlay />
          <main
            id="main-content"
            className="docs-main"
          >
            {children}
          </main>
        </div>
        <DocsFooter />
      </div>
    </SidebarProvider>
  );
}
