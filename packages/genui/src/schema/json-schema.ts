// The JSON Schema (2020-12), generated from the catalog so the two can't drift. Published as
// @nexub/genui/schema/v1.json, and narrowed per host by toolSchema() for an LLM's
// structured-output or tool-input parameter.
import { ACTION_NAME, KEY, MAX_TEXT, catalog as fullCatalog, type GenUICatalog, type GenUIPropSpec } from './catalog.js';

export const SCHEMA_ID = 'https://unpkg.com/@nexub/genui/dist/schema/v1.json';

type Json = Record<string, unknown>;

function propSchema(p: GenUIPropSpec): Json {
  const description = p.description;
  switch (p.type) {
    case 'text':
      return { type: 'string', maxLength: p.maxLength ?? MAX_TEXT, description };
    case 'enum':
      return { enum: [...p.values], ...(p.default !== undefined && { default: p.default }), description };
    case 'boolean':
      return { type: 'boolean', ...(p.default !== undefined && { default: p.default }), description };
    case 'action':
      return {
        type: 'object',
        properties: { name: { type: 'string', pattern: ACTION_NAME.source }, payload: { description: 'Any JSON, up to 4 kB.' } },
        required: ['name'],
        additionalProperties: false,
        description,
      };
    case 'list': {
      const required = Object.entries(p.item).filter(([, f]) => 'required' in f && f.required).map(([k]) => k);
      return {
        type: 'array',
        maxItems: p.maxItems,
        items: {
          type: 'object',
          properties: Object.fromEntries(Object.entries(p.item).map(([k, f]) => [k, propSchema(f)])),
          required,
          additionalProperties: false,
        },
        description,
      };
    }
    case 'rows':
      return {
        type: 'array',
        maxItems: p.maxItems,
        items: {
          type: 'array',
          maxItems: p.maxCells,
          items: { anyOf: [{ type: 'string', maxLength: MAX_TEXT }, { type: 'number' }, { type: 'boolean' }, { type: 'null' }] },
        },
        description,
      };
  }
}

/** The document schema for a catalog (default: the whole v1 catalog). */
export function toolSchema(catalog: GenUICatalog = fullCatalog): Json {
  const defs: Json = {};
  for (const name of catalog.names) {
    const spec = fullCatalog.get(name)!;
    const required = Object.entries(spec.props).filter(([, p]) => 'required' in p && p.required).map(([k]) => k);
    defs[name] = {
      type: 'object',
      description: spec.description,
      properties: {
        type: { const: name },
        key: { type: 'string', pattern: KEY.source },
        props: {
          type: 'object',
          properties: Object.fromEntries(Object.entries(spec.props).map(([k, p]) => [k, propSchema(p)])),
          ...(required.length && { required }),
          additionalProperties: false,
        },
        ...(spec.container && {
          children: { type: 'array', items: { anyOf: [{ $ref: '#/$defs/node' }, { type: 'string', maxLength: MAX_TEXT }] } },
        }),
      },
      required: required.length ? ['type', 'props'] : ['type'],
      additionalProperties: false,
    };
  }
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: SCHEMA_ID,
    title: 'Nexub generative UI document, version 1',
    description:
      'A UI answer that Nexub renders with its own components. Only the listed components and props are allowed; strings are text, never HTML or Markdown; buttons send named actions the host accepts.',
    type: 'object',
    properties: {
      $schema: { type: 'string' },
      version: { type: 'string', pattern: '^1\\.\\d+$', description: 'Write "1.0".' },
      title: { type: 'string', maxLength: MAX_TEXT, description: 'The accessible name of the answer.' },
      root: { $ref: '#/$defs/node' },
    },
    required: ['version', 'root'],
    additionalProperties: false,
    $defs: { node: { oneOf: catalog.names.map((n) => ({ $ref: `#/$defs/${n}` })) }, ...defs },
  };
}

/** The JSON Schema of the whole v1 catalog (also published as `@nexub/genui/schema/v1.json`). */
export const schema: Json = toolSchema();
