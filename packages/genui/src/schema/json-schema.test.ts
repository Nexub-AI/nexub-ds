import { describe, expect, it } from 'vitest';
import { catalog, schema, toolSchema, SCHEMA_ID } from './index.js';

type Def = { properties: { type: { const: string }; props: { properties: Record<string, unknown>; required?: string[] }; children?: unknown } };

describe('JSON Schema', () => {
  it('is a 2020-12 schema generated from the catalog', () => {
    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(schema.$id).toBe(SCHEMA_ID);
    const defs = schema.$defs as Record<string, Def>;
    for (const name of catalog.names) {
      const spec = catalog.get(name)!;
      const def = defs[name]!;
      expect(def.properties.type.const).toBe(name);
      expect(Object.keys(def.properties.props.properties)).toEqual(Object.keys(spec.props));
      expect(Boolean(def.properties.children)).toBe(spec.container);
      const required = Object.entries(spec.props).filter(([, p]) => 'required' in p && p.required).map(([k]) => k);
      expect(def.properties.props.required ?? []).toEqual(required);
    }
  });

  it('allows nothing the catalog does not list', () => {
    expect(schema.additionalProperties).toBe(false);
    for (const def of Object.values(schema.$defs as Record<string, Def & { additionalProperties?: boolean }>)) {
      if ('oneOf' in def) continue;
      expect(def.additionalProperties).toBe(false);
      expect((def.properties.props as { additionalProperties?: boolean }).additionalProperties).toBe(false);
    }
  });

  it('narrows to a catalog for tool input', () => {
    const narrow = toolSchema(catalog.only(['Card', 'Badge']));
    expect(Object.keys(narrow.$defs as object)).toEqual(['node', 'Card', 'Badge']);
    expect(JSON.parse(JSON.stringify(narrow))).toEqual(narrow);
  });
});
