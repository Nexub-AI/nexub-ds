import * as React from 'react';
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
        {/* 12.1: each client part hydrates in its own task (mobile Lighthouse TBT). Nothing
            suspends, so the server HTML and the first paint are unchanged. */}
        <React.Suspense>
          <DocsHeader />
        </React.Suspense>
        <div className="relative flex flex-1">
          <React.Suspense>
            <DocsSidebar navGroups={navGroups} />
          </React.Suspense>
          <main id="main-content" className="docs-main">
            <div className="docs-page-top">
              <React.Suspense>
                <DocsBreadcrumbs navGroups={navGroups} />
                <MobileTOC />
              </React.Suspense>
            </div>
            {children}
            <React.Suspense>
              <DocsPager navGroups={navGroups} />
            </React.Suspense>
          </main>
        </div>
        <DocsFooter />
      </div>
    </SidebarProvider>
  );
}
