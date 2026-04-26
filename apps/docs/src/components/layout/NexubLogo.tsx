import * as React from 'react';
import Image from 'next/image';

interface NexubLogoProps {
  /** Icon height in px. Default 32. */
  size?: number;
}

/**
 * Nexub icon mark — uses the real brand SVG from /public/nexub-icon.svg.
 * The SVG has native multi-stop gradients so it renders correctly at any size.
 */
export function NexubLogo({ size = 32 }: NexubLogoProps) {
  // The icon's native aspect ratio is 78 × 56
  const width = Math.round((size * 78) / 56);

  return (
    <Image
      src="/nexub-icon.svg"
      alt="Nexub"
      width={width}
      height={size}
      priority
      style={{ display: 'block', flexShrink: 0 }}
    />
  );
}
