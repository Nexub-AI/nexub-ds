// Shared popper defaults (10.6 phone-first overlays).

/** Gap (px, Radix's `collisionPadding`) every popper keeps from the viewport edge. */
export const COLLISION_PADDING = 8;

/**
 * `true`: always a bottom sheet. `'auto'`: a bottom sheet below the `md`
 * breakpoint, the normal popover above. Rendered as `data-nx-sheet`; the CSS
 * lives in @nexub/themes core.css.
 *
 * @default 'auto' (pass `sheet={false}` to keep a popover on small screens)
 */
export type SheetProp = boolean | 'auto';

/**
 * A Radix Arrow is a direct `span > svg` child drawn outside the content box,
 * so scrolling content would clip it: content with an arrow keeps today's
 * uncapped, visible overflow.
 * ponytail: matches any direct span > svg child; give Arrow a wrapper-free slot if that ever misfires.
 */
export const arrowSafe = 'has-[>span>svg]:max-h-none has-[>span>svg]:overflow-visible';
