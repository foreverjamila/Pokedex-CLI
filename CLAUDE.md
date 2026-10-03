# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Pokedex command-line REPL in TypeScript, built as a Boot.dev guided project and then extended (save to disk, Poke Ball types, a full unit test suite). It talks to the public PokeAPI (`https://pokeapi.co/api/v2`).

## Commands

Run `nvm use` first (Node 22.15.0 from `.nvmrc`). On this WSL machine, if nvm isn't loaded, `npm` resolves to the Windows install and fails with "UNC paths are not supported".

- `npm run build`: compile `src/` to `dist/` with `tsc` (this is also the type check; there's no linter)
- `npm run dev`: build, then start the REPL
- `npm test`: run all Vitest tests once
- Single file: `npx vitest --run src/command_catch.test.ts`
- Single test by name: `npx vitest --run -t "is capped at 1"`

When driving the REPL from a script (`(echo map; sleep 2; echo exit) | node dist/main.js`), leave a pause between lines. readline fires the next `line` event without waiting for the previous async command, so a fast `exit` can kill a command that's still fetching.

## Architecture

**Startup:** `main.ts` calls `initState()` (`state.ts`), which creates the readline interface, the command registry, the `PokeAPI` client and the Pokedex loaded from disk. It then hands that `State` to `startREPL()` (`repl.ts`).

**State is the only thing commands receive.** Every command has the signature `callback(state: State, ...args: string[]) => Promise<void>`. Shared data (pagination URLs, the Pokedex, the save path, the API client) goes on `State` rather than in extra parameters. Commands that take no args just declare `(state)`.

**Commands:** each lives in `src/command_<name>.ts` and is registered in `getCommands()` (`command.ts`). `help` lists the registry, so registering is all that's needed. `repl.ts` lowercases and splits the input, looks up `words[0]`, and awaits the callback with the remaining words. Commands report bad input by **throwing**; the REPL catches it and prints only `err.message`.

**API and cache:** `PokeAPI` (`pokeapi.ts`) owns a `Cache` (`pokecache.ts`), keyed by the **exact request URL**, with a `setInterval` reap loop that drops entries older than the interval (5 minutes in the app). That timer keeps Node alive, so `exit` calls `pokeAPI.closeCache()`, and any test that creates a `Cache`/`PokeAPI` must stop it. `fetchPokemon` passes responses through `toPokemon()` so only the fields in the `Pokemon` type are kept; extend both together when you need a new field.

**Saving:** `storage.ts` loads `pokedex.json` (path relative to the current working directory, gitignored) at startup and `command_catch.ts` saves after every successful catch. A missing or corrupt file starts an empty Pokedex.

**Import cycles:** `state.ts` → `command.ts` → `command_*.ts` → `state.ts`. This only works because command files import `State` with `import type`, which is erased at compile time. Keep it that way.

## Testing

- `vitest.config.ts` limits tests to `src/**/*.test.ts`. `tsc` also compiles tests into `dist/`, so without that, every test ran twice. It also sets `restoreMocks` and `unstubGlobals`.
- `src/test_helpers.ts` has `makeState()` (a fake `State` whose `pokedexPath` is in a fresh temp dir, with a partial fake `pokeAPI`), `captureLogs()` (spies on `console.log` and returns the printed lines), and the `PIDGEY` fixture.
- Tests never hit the network or the real `pokedex.json`: fake `fetch` with `vi.stubGlobal`, force catch outcomes with `vi.spyOn(Math, "random")`, and use `vi.useFakeTimers()` for anything time-based (the cache test was flaky with real timers).

## Conventions and gotchas

- **ESM only** (`"type": "module"`, `nodenext`): relative imports in `.ts` files must use the `.js` extension, or the compiled output fails at runtime.
- **Strict mode** is on. `dist/` is build output: never edit it, never commit it.
- Only dev dependencies (TypeScript, `@types/node`, Vitest). Prefer Node built-ins (`node:readline`, `node:fs`, global `fetch`) over adding packages.
- **Output text is matched exactly** by the Boot.dev CLI tests and by the unit tests (e.g. `Throwing a Pokeball at <name>...`, inspect's `  -hp: 40` vs `  - normal`). Change a message only on purpose, and update the tests with it.
- Known limitation: the first `map` caches page 1 under `/location-area`, but the API's `previous` link for page 1 is `/location-area?offset=0&limit=20`, so returning to page 1 with `mapb` misses the cache once. It was left as is on purpose to match the course spec.

## Git workflow

- One branch per feature, created from an up-to-date `main` (e.g. `feat/pokeballs`, `chore/more-tests`), merged through a GitHub PR.
- One logical change per commit, prefixed `feat:`, `fix:`, `chore:` or `docs:`.
- Never commit `node_modules/`, `dist/`, `repl.log` or `pokedex.json`.
