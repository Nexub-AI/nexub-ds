---
'@nexub/react': minor
---

12.1 Performance: every component works with the React Compiler. CI runs the full `@nexub/react` suite on compiled components (`pnpm --filter @nexub/react test:compiler`). Fix: with the compiler on, a DataTable row kept its old cells after selection, and a tree row its old expand state, because TanStack Table changes its row objects in place. The two functions that read them now opt out with `'use no memo'`.
