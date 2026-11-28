// @nexub/genui (@alpha): renders the generative UI documents agents return, with @nexub/react
// components, validated before render (RFC #823). The format itself is @nexub/genui/schema.
export { GenUI } from './GenUI.js';
export type { GenUIProps, GenUIActionEvent } from './GenUI.js';
export { genuiMessages } from './messages.js';
export { catalog, validate, parsePartial, schema, toolSchema, GENUI_VERSION } from './schema/index.js';
export type {
  GenUICatalog,
  GenUIDocument,
  GenUINode,
  GenUIChild,
  GenUIAction,
  GenUIIssue,
  GenUIIssueCode,
  GenUILimits,
  GenUIOnInvalid,
  GenUIVersion,
  ValidateOptions,
  ValidateResult,
} from './schema/index.js';
