Title: Remove unused root/src and unify on apps/fiat-crypto-converter/src

Summary
- Goal: Use `apps/fiat-crypto-converter/src` as the only source of truth.
- Removed the unused `./src` at the repository root after verifying no consumers.

Scope
- Root: `./src`, `**/tsconfig*.json`, `**/vite.config.*`
- App: `apps/fiat-crypto-converter/**`

Investigation (imports/aliases/paths)
- Scan (before removal):
  - No app imports referenced the root `./src`.
  - App `tsconfig*.json` contained no `baseUrl`/`paths` that would map `@/*`.
  - App `vite.config.ts` had no `resolve.alias` for `@`.
- Found alias usages only inside the root `./src` (which we are removing).

Commands and outputs (abridged)
```
# References scan
rg -n "from 'src/|from \"src/|@/" -S

# Result (abridged):
src/lib/pricing.ts:1:import type { Fiat, PriceResult, TokenDef } from '@/types/index.ts';
src/lib/pricing.ts:2:import { coingeckoPrice } from '@/adapters/coingecko.ts';
src/lib/pricing.ts:3:import { cmcPrice } from '@/adapters/cmc.ts';

# App TS configs
apps/fiat-crypto-converter/tsconfig.json
apps/fiat-crypto-converter/tsconfig.app.json
```

Backup → Build verification → Delete
```
# Backup root/src
mkdir -p packages/_trash_backup
mv src packages/_trash_backup/root_src_backup

# Build app
cd apps/fiat-crypto-converter
npm run build

# Build success (vite)
✓ built in ~1–2s

# Delete backup
rm -rf ../../packages/_trash_backup/root_src_backup
```

Acceptance criteria
- No references to root `./src` via imports/paths/aliases remain (app side = zero).
- `apps/fiat-crypto-converter` build succeeded.
- This log documents backup → verification → deletion steps.

PR plan (manual, due to network restrictions)
1) Create a branch:
   - `git switch -c chore/remove-root-src`
2) Commit docs and README note:
   - `git add apps/fiat-crypto-converter/docs/root-src-removal-log.md apps/fiat-crypto-converter/README.md`
   - `git commit -m "docs: log removal of root/src and define source of truth"`
3) Push and open PR:
   - `git push -u origin chore/remove-root-src`
   - Open a PR with title: "chore: remove unused root/src and unify source of truth"
   - Include: rationale (dup removal, confusion reduction), verification logs (this file), and acceptance criteria.

Notes
- If any future consumer needs shared code, prefer extracting common modules into a shared package (e.g., `packages/shared`) instead of duplicating `src` trees.

