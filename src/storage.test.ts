import { writeFileSync } from "node:fs";
import { expect, test } from "vitest";
import { loadPokedex, savePokedex } from "./storage.js";
import { PIDGEY, captureLogs, makeState } from "./test_helpers.js";

test("a saved pokedex loads back the same", () => {
  const { pokedexPath } = makeState();
  savePokedex(pokedexPath, { pidgey: PIDGEY });
  expect(loadPokedex(pokedexPath)).toEqual({ pidgey: PIDGEY });
});

test("a missing file loads as an empty pokedex", () => {
  const { pokedexPath } = makeState();
  expect(loadPokedex(pokedexPath)).toEqual({});
});

test("a corrupted file warns and loads as an empty pokedex", () => {
  const lines = captureLogs();
  const { pokedexPath } = makeState();
  writeFileSync(pokedexPath, "{ not json");

  expect(loadPokedex(pokedexPath)).toEqual({});
  expect(lines[0]).toContain("Warning: could not read");
});
