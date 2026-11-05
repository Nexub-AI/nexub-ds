'use client';

// Built as its own bundle (tsup.config.ts) so vaul's style injection can be
// stripped; every other module is compiled one file per source file.
export { Drawer } from 'vaul';
