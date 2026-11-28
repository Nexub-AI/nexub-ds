// @nexub/genui/schema (@alpha): the document format with no React and no DOM, for servers,
// @nexub/mcp and the renderer. RFC #823.
export { catalog, TONES, MAX_TEXT, MAX_LONG_TEXT, MAX_PAYLOAD_BYTES } from './catalog.js';
export type { GenUICatalog, GenUIComponentSpec, GenUIPropSpec } from './catalog.js';
export { validate } from './validate.js';
export type { ValidateOptions, ValidateResult } from './validate.js';
export { parsePartial } from './parse-partial.js';
export type { ParsePartialResult } from './parse-partial.js';
export { schema, toolSchema, SCHEMA_ID } from './json-schema.js';
export { DEFAULT_LIMITS } from './limits.js';
export type {
  GenUIAction,
  GenUICell,
  GenUIChild,
  GenUIDescriptionItem,
  GenUIDocument,
  GenUIIssue,
  GenUIIssueCode,
  GenUIJson,
  GenUILimits,
  GenUINode,
  GenUIOnInvalid,
  GenUIPendingNode,
  GenUIPropsByType,
  GenUITableColumn,
  GenUITone,
  GenUIType,
  GenUIVersion,
} from './types.js';

/** The schema version this release writes and reads. */
export const GENUI_VERSION = '1.0';
