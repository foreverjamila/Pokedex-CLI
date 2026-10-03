# Pokedex-CLI

A Pokedex you play in your terminal. Browse the locations of the Pokemon world, see which Pokemon live there, throw Poke Balls to catch them, and build up a Pokedex that's saved between sessions.

It's written in TypeScript on Node.js, with live data from [PokeAPI](https://pokeapi.co/). It started as a [Boot.dev](https://www.boot.dev/) guided project and was then extended with saving, different Poke Balls and a full unit test suite.

```
Pokedex > explore pastoria-city-area
Exploring pastoria-city-area...
Found Pokemon:
 - tentacool
 - magikarp
 - gyarados
 ...
Pokedex > catch magikarp ultraball
Throwing an Ultra Ball at magikarp...
magikarp was caught!
You may now inspect it with the inspect command.
Pokedex > inspect magikarp
Name: magikarp
Height: 9
Weight: 100
Stats:
  -hp: 20
  -attack: 10
  -defense: 55
  -special-attack: 15
  -special-defense: 20
  -speed: 80
Types:
  - water
```

## Features

- **Explore the world**: page through every location area in the games, 20 at a time, and list the Pokemon you can find in each one.
- **Catch Pokemon**: each throw is a dice roll. Stronger Pokemon (higher base experience) are harder to catch, and better balls improve your odds.
- **Inspect your catches**: view height, weight, base stats and types for any Pokemon you've caught, without another network request.
- **Progress is saved**: your Pokedex is written to `pokedex.json` after every catch and loaded again the next time you start.
- **Fast repeat requests**: API responses are cached in memory, so going back to a page or area you've already seen is instant.
- **No runtime dependencies**: only Node built-ins (`readline`, `fs`, `fetch`).

## Getting started

You need Node.js **22.15.0** (pinned in `.nvmrc`) and an internet connection for PokeAPI.

```bash
git clone https://github.com/foreverjamila/Pokedex-CLI.git
cd Pokedex-CLI
nvm use          # or install Node 22.15.0 another way
npm install
npm run dev      # compiles and starts the REPL
```

After the first build, `npm run start` starts the REPL without recompiling.

## Commands

| Command | What it does |
|---|---|
| `help` | List all commands |
| `map` | Show the next 20 location areas |
| `mapb` | Show the previous 20 location areas (says so if you're already on the first page) |
| `explore <area>` | List the Pokemon found in a location area, e.g. `explore pastoria-city-area` |
| `catch <pokemon> [ball]` | Throw a ball at a Pokemon. `ball` is `pokeball` (default), `greatball` or `ultraball` |
| `inspect <pokemon>` | Show details for a Pokemon you've caught |
| `pokedex` | List every Pokemon you've caught, in the order you caught them |
| `exit` | Quit |

Input isn't case-sensitive, and extra spaces are ignored.

A typical first session: `map` to find an area name, `explore <area>` to see who lives there, `catch <pokemon>` until it works, then `inspect <pokemon>`.

## How catching works

The chance of catching a Pokemon is:

```
chance = ball multiplier × 100 / (base experience + 100)     (capped at 100%)
```

| Pokemon (base exp) | Pokeball (1×) | Great Ball (1.5×) | Ultra Ball (2×) |
|---|---|---|---|
| squirtle (63) | 61% | 92% | 100% |
| pikachu (112) | 47% | 71% | 94% |
| mewtwo (306) | 25% | 37% | 49% |

The chance never reaches zero, so even legendary Pokemon can be caught with some patience. Balls are unlimited.

## Saved progress

Caught Pokemon are saved to `pokedex.json` **in the folder you start the app from**, so running it from a different folder starts a separate Pokedex. The file is plain, readable JSON that keeps only the details the app uses (id, name, base experience, height, weight, stats, types). Delete it to start over. If the file is ever corrupted, the app prints a warning and starts with an empty Pokedex instead of crashing.

## Development

| Script | Purpose |
|---|---|
| `npm run build` | Compile `src/` to `dist/` with `tsc`. This is also the type check |
| `npm run dev` | Build, then start the REPL |
| `npm run start` | Start the already-built REPL |
| `npm test` | Run the Vitest suite once |

Run one test file with `npx vitest --run src/command_catch.test.ts`, or one test by name with `npx vitest --run -t "is capped at 1"`.

### How it's built

- **REPL** (`src/repl.ts`): reads each line with `node:readline`, splits it into a command name and arguments, and runs the matching command.
- **Command registry** (`src/command.ts`): maps each command name to a description and a callback. `help` is generated from this registry, so a new command shows up in `help` as soon as it's registered. Each command lives in its own `src/command_<name>.ts` file.
- **Shared state** (`src/state.ts`): every command receives one `State` object holding the readline interface, the registry, the API client, pagination URLs and the Pokedex. All commands have the same signature: `(state, ...args) => Promise<void>`.
- **API client** (`src/pokeapi.ts`): fetches location areas and Pokemon from PokeAPI and checks the cache first.
- **Cache** (`src/pokecache.ts`): a generic in-memory cache keyed by request URL. A background timer removes entries older than 5 minutes.
- **Storage** (`src/storage.ts`): loads and saves `pokedex.json`.

### Tests

The suite uses [Vitest](https://vitest.dev/) and covers input parsing, the cache, the API client, saving and loading, and the `catch`, `inspect`, `pokedex` and `explore` commands. The tests never use the network or your real save file:

- `fetch` is replaced with a fake (`vi.stubGlobal`)
- catch rolls are fixed by mocking `Math.random`
- cache expiry uses fake timers, so it's exact and instant
- save files go to a temporary folder

Shared helpers live in `src/test_helpers.ts`.

## Credits

- Pokemon data from [PokeAPI](https://pokeapi.co/)
- Original project outline from [Boot.dev](https://www.boot.dev/)
