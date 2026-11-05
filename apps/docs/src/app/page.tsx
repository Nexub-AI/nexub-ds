import { componentEntries, navGroups, patternEntries } from '@/registry/index';
import { DocsHeader } from '@/components/layout/DocsHeader';
import { DocsSidebar } from '@/components/layout/DocsSidebar';
import { DocsFooter } from '@/components/layout/DocsFooter';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { DS_VERSION } from '@/components/docs/VersionBadge';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingCallout } from '@/components/landing/LandingCallout';

export default function HomePage() {
  return (
    <SidebarProvider>
      <DocsHeader />
      {/* Phone drawer only: the landing page has no sidebar column. */}
      <DocsSidebar navGroups={navGroups} drawerOnly />
      <main className="bg-[var(--color-surface)] text-[var(--color-on-surface)]">
        <LandingHero
          version={DS_VERSION}
          componentCount={componentEntries.length}
          patternCount={patternEntries.length}
        />
        <LandingFeatures />
        <LandingCallout />
      </main>
      <DocsFooter />
    </SidebarProvider>
  );
}
