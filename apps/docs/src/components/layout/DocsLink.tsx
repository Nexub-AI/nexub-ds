'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = React.ComponentProps<typeof Link>;

/**
 * A `next/link` that prefetches on intent (hover, focus, touch) instead of on
 * viewport entry. Lists with dozens of links (sidebar, components index) would
 * otherwise prefetch every route on load: about 180 requests per page view,
 * each one a Cloudflare Pages Function invocation.
 */
export const DocsLink = React.forwardRef<HTMLAnchorElement, Props>(function DocsLink(
  { href, onMouseEnter, onFocus, onTouchStart, ...rest },
  ref,
) {
  const router = useRouter();
  const prefetched = React.useRef(false);
  const prefetch = () => {
    if (prefetched.current || typeof href !== 'string') return;
    prefetched.current = true;
    router.prefetch(href);
  };
  return (
    <Link
      ref={ref}
      href={href}
      prefetch={false}
      onMouseEnter={(e) => { prefetch(); onMouseEnter?.(e); }}
      onFocus={(e) => { prefetch(); onFocus?.(e); }}
      onTouchStart={(e) => { prefetch(); onTouchStart?.(e); }}
      {...rest}
    />
  );
});
