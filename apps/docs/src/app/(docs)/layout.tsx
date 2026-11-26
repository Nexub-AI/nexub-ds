import { DocsHeader } from '@/components/layout/DocsHeader';
import { DocsSidebar } from '@/components/layout/DocsSidebar';
import { DocsFooter } from '@/components/layout/DocsFooter';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { DocsBreadcrumbs, DocsPager } from '@/components/layout/PageNav';
import { MobileTOC } from '@/components/docs/MobileTOC';
import { navGroups } from '@/registry/index';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <SkipToContent />
        <DocsHeader />
        <div className="relative flex flex-1">
          <DocsSidebar navGroups={navGroups} />
          <main id="main-content" className="docs-main">
            <div className="docs-page-top">
              <DocsBreadcrumbs navGroups={navGroups} />
              <MobileTOC />
            </div>
            {children}
            <DocsPager navGroups={navGroups} />
          </main>
        </div>
        <DocsFooter />
      </div>
    </SidebarProvider>
  );
}
