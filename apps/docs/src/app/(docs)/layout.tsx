import { DocsHeader } from '@/components/layout/DocsHeader';
import { DocsSidebar } from '@/components/layout/DocsSidebar';
import { DocsFooter } from '@/components/layout/DocsFooter';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { VersionBadge } from '@/components/docs/VersionBadge';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { navGroups } from '@/registry/index';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <SkipToContent />
        <DocsHeader versionBadge={<VersionBadge />} />
        <div className="relative flex flex-1">
          <DocsSidebar navGroups={navGroups} />
          <main id="main-content" className="docs-main">
            {children}
          </main>
        </div>
        <DocsFooter />
      </div>
    </SidebarProvider>
  );
}
