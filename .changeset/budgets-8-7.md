---
'@nexub/react': minor
---

8.7: budgets and performance. No API change.

- Bundle budgets only go down. `pnpm check:size --update` now lowers each budget to its current size (rounded up to 100 B) and never raises one, and every budget was ratcheted down in this release. A raise is a hand edit that the PR has to explain under a `## Budget raises` heading; CI fails one that isn't explained.
- Smaller without raising limits: the bundled vaul (Drawer) is shipped minified (Drawer 15.4 → 11.1 kB gzip), and Combobox draws its loading ring inline instead of importing Spinner (3.4 → 2.7 kB). The whole `@nexub/react` graph is 187 kB, down from 193 kB.
- The interaction budgets from 7.7 (INP-like ≤ 200 ms and no long task over 100 ms for DataTable, Combobox and Kanban) stay blocking in the visual job.
