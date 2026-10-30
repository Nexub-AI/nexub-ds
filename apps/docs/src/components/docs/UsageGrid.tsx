import type { UsageDef } from '@/registry/types';
import { Guidance } from '@/components/kit';

export function UsageGrid({ usage }: { usage: UsageDef }) {
  return <Guidance doTitle="Use it for" dontTitle="Use something else for" dos={usage.whenToUse} donts={usage.whenNotToUse} />;
}
