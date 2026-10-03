import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { vi } from "vitest";
import type { PokeAPI, Pokemon } from "./pokeapi.js";
import type { State } from "./state.js";

type StateOverrides = Partial<Omit<State, "pokeAPI">> & {
  pokeAPI?: Partial<PokeAPI>;
};

// A minimal State for testing commands: no readline, and the save file
// goes in a fresh temp folder so the real pokedex.json is never touched.
export function makeState(overrides: StateOverrides = {}): State {
  const dir = mkdtempSync(join(tmpdir(), "pokedex-test-"));
  return {
    pokedex: {},
    pokedexPath: join(dir, "pokedex.json"),
    ...overrides,
  } as unknown as State;
}

// Swallows console.log output and records each printed line.
export function captureLogs(): string[] {
  const lines: string[] = [];
  vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    lines.push(args.join(" "));
  });
  return lines;
}

export const PIDGEY: Pokemon = {
  id: 16,
  name: "pidgey",
  base_experience: 50,
  height: 3,
  weight: 18,
  stats: [
    { base_stat: 40, stat: { name: "hp" } },
    { base_stat: 45, stat: { name: "attack" } },
    { base_stat: 40, stat: { name: "defense" } },
    { base_stat: 35, stat: { name: "special-attack" } },
    { base_stat: 35, stat: { name: "special-defense" } },
    { base_stat: 56, stat: { name: "speed" } },
  ],
  types: [{ type: { name: "normal" } }, { type: { name: "flying" } }],
};
