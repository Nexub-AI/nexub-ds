// Writes dist/schema/v1.json (the `@nexub/genui/schema/v1.json` export) from the built catalog,
// so the published JSON Schema is the one validate() and the MCP tools use.
import { writeFileSync } from 'node:fs';
import { schema } from '../dist/schema/index.js';

writeFileSync(new URL('../dist/schema/v1.json', import.meta.url), `${JSON.stringify(schema, null, 2)}\n`);
