import { existsSync } from "node:fs";
import { describe, expect, test, vi } from "vitest";
import { catchChance, commandCatch } from "./command_catch.js";
import { loadPokedex } from "./storage.js";
import { PIDGEY, captureLogs, makeState } from "./test_helpers.js";

function stateWithPidgey() {
  const fetchPokemon = vi.fn(async () => PIDGEY);
  return { state: makeState({ pokeAPI: { fetchPokemon } }), fetchPokemon };
}

describe("catchChance", () => {
  test.each([
    { baseExperience: 100, multiplier: 1, expected: 0.5 },
    { baseExperience: 300, multiplier: 1, expected: 0.25 },
    { baseExperience: 300, multiplier: 1.5, expected: 0.375 },
    { baseExperience: 300, multiplier: 2, expected: 0.5 },
  ])("base $baseExperience x$multiplier = $expected", ({ baseExperience, multiplier, expected }) => {
    expect(catchChance(baseExperience, multiplier)).toBeCloseTo(expected);
  });

  test("is capped at 1", () => {
    expect(catchChance(39, 2)).toBe(1);
  });
});

describe("commandCatch", () => {
  test("a successful catch adds the pokemon and saves the pokedex", async () => {
    const lines = captureLogs();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { state } = stateWithPidgey();

    await commandCatch(state, "pidgey");

    expect(lines).toEqual([
      "Throwing a Pokeball at pidgey...",
      "pidgey was caught!",
      "You may now inspect it with the inspect command.",
    ]);
    expect(state.pokedex.pidgey).toEqual(PIDGEY);
    expect(loadPokedex(state.pokedexPath)).toEqual({ pidgey: PIDGEY });
  });

  test("an escape does not add or save anything", async () => {
    const lines = captureLogs();
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    const { state } = stateWithPidgey();

    await commandCatch(state, "pidgey");

    expect(lines).toEqual(["Throwing a Pokeball at pidgey...", "pidgey escaped!"]);
    expect(state.pokedex).toEqual({});
    expect(existsSync(state.pokedexPath)).toBe(false);
  });

  test.each([
    { ball: "greatball", message: "Throwing a Great Ball at pidgey..." },
    { ball: "ultraball", message: "Throwing an Ultra Ball at pidgey..." },
  ])("$ball prints the right message", async ({ ball, message }) => {
    const lines = captureLogs();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { state } = stateWithPidgey();

    await commandCatch(state, "pidgey", ball);

    expect(lines[0]).toBe(message);
  });

  test.each(["masterball", "toString"])("rejects unknown ball '%s' before fetching", async (ball) => {
    captureLogs();
    const { state, fetchPokemon } = stateWithPidgey();

    await expect(commandCatch(state, "pidgey", ball)).rejects.toThrow(`unknown ball '${ball}'`);
    expect(fetchPokemon).not.toHaveBeenCalled();
  });

  test.each([[[]], [["a", "b", "c"]]])("rejects %j arguments with a usage error", async (args) => {
    const { state } = stateWithPidgey();
    await expect(commandCatch(state, ...args)).rejects.toThrow("usage: catch");
  });
});
