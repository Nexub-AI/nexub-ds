// Prop vocabulary shared by web and native components, so the same prop means
// the same thing on both platforms.

/** Semantic or product tone: overrides a component's colour with a role. */
export type ToneValue =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'leap'
  | 'bookub'
  | 'payub'
  | 'founderub';

/** Nexub product brands; each remaps the tertiary role family. */
export type Product = 'leap' | 'bookub' | 'payub' | 'founderub';

/** Glass intensity dial (user preference). 'off' makes every glass surface solid. */
export type GlassMode = 'clear' | 'balanced' | 'tinted' | 'off';

/** Contrast level of the colour scheme. */
export type ContrastLevel = 'standard' | 'medium' | 'high';

/** The control ladder (24 / 32 / 40 / 48 / 56). */
export type ControlSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
