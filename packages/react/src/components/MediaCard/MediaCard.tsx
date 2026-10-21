import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { glassSurfaceClass } from '../../utils/glass.js';

export type MediaCardRatio = '16/9' | '4/3' | '1/1' | '3/4';

const ratioClass: Record<MediaCardRatio, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
};

export interface MediaCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  src: string;
  /** Required. Pass '' when the image is decorative. */
  alt: string;
  /** @default '16/9' */
  ratio?: MediaCardRatio;
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Makes the whole card one link, stretched from the title (so needs `title`). */
  href?: string;
  /** Actions; they stay clickable above the stretched link. */
  children?: React.ReactNode;
}

/**
 * An image card with a glass caption over a soft bottom scrim.
 *
 * Layers stack in one grid cell rather than with absolute positioning: the
 * glass panel's backdrop-filter would otherwise become the containing block of
 * the stretched link's ::after, shrinking the hit area to the caption.
 */
export const MediaCard = React.forwardRef<HTMLDivElement, MediaCardProps>(
  ({ src, alt, ratio = '16/9', title, description, eyebrow, href, className, children, ...props }, ref) => {
    const hasCaption = title != null || description != null || eyebrow != null || children != null;
    return (
      <div
        ref={ref}
        className={cn(
          'group relative grid overflow-hidden rounded-shape-container border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-container-high)]',
          href &&
            'shadow-elevation-1 transition-[box-shadow,transform] duration-effects-fast ease-effects-fast hover:shadow-elevation-2 hover:duration-spatial-default hover:ease-spatial-default motion-safe:hover:-translate-y-0.5 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-[var(--color-primary)]',
          className,
        )}
        {...props}
      >
        {/* ponytail: a caption taller than the image box overflows the image; fine for card-length copy. */}
        <div className={cn('relative [grid-area:1/1]', ratioClass[ratio])}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              href &&
                'transition-transform duration-effects-fast ease-effects-fast motion-safe:group-hover:scale-[1.03] group-hover:duration-spatial-default group-hover:ease-spatial-default',
            )}
          />
        </div>
        {hasCaption && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none h-2/3 self-end bg-gradient-to-t from-[color-mix(in_srgb,var(--color-scrim,black)_45%,transparent)] to-transparent [grid-area:1/1]"
            />
            <div className="m-1 grid self-end [grid-area:1/1]">
              <div
                aria-hidden="true"
                data-material="glass"
                data-glass-thickness="thin"
                className={cn('rounded-shape-field [grid-area:1/1]', glassSurfaceClass)}
              />
              {/* z-[1] on a grid item stacks above the glass without becoming the link's containing block. */}
              <div className="z-[1] flex flex-col gap-0.5 px-3 py-2.5 [grid-area:1/1]">
                {eyebrow != null && (
                  <span className="text-label-sm text-[var(--color-on-surface-variant)]">{eyebrow}</span>
                )}
                {title != null && (
                  <h3 className="text-title-sm text-[var(--color-on-surface)]">
                    {href ? (
                      <a href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                        {title}
                      </a>
                    ) : (
                      title
                    )}
                  </h3>
                )}
                {description != null && (
                  <p className="text-body-sm text-[var(--color-on-surface-variant)]">{description}</p>
                )}
                {children != null && <div className="relative z-[1] mt-2 flex flex-wrap gap-2">{children}</div>}
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
);
MediaCard.displayName = 'MediaCard';
