# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Pokedex command-line REPL written in TypeScript (a Boot.dev guided project). It is in early scaffolding: `src/main.ts` is the entry point and currently only defines and calls a placeholder `main()`.

## Commands

- `npm run build`: compile `src/` to `dist/` with `tsc`
- `npm run start`: run the compiled app (`node dist/main.js`)
- `npm run dev`: build and then run

Node version is pinned in `.nvmrc` (22.15.0), so run `nvm use` first. No test runner or linter is configured yet.

## Conventions and gotchas

- **ESM only**: `package.json` sets `"type": "module"` and tsconfig uses `module`/`moduleResolution: "nodenext"`. Relative imports in `.ts` files must use the `.js` extension (e.g. `import { foo } from "./repl.js"`), or the compiled output will fail at runtime.
- **Strict mode** is on (`"strict": true`).
- All source lives under `src/` (`rootDir`); compiled output goes to `dist/`, which is gitignored and should never be edited by hand.
- The only dependencies are dev dependencies (TypeScript 7, `@types/node`). Prefer Node built-ins (e.g. `node:readline`, global `fetch`) over adding packages.

## Git workflow
- Chapter 1 on `main`; chapters 2 and 3 on `feat/cache` and `feat/pokedex`
- One logical change per commit, prefixed `feat:`, `fix:`, `chore:`, `docs:`
- Never commit `node_modules/` or `dist/`
