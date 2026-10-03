import { expect, test, vi } from "vitest";
import { commandExplore } from "./command_explore.js";
import { captureLogs, makeState } from "./test_helpers.js";

test("lists the pokemon found in an area", async () => {
  const lines = captureLogs();
  const fetchLocation = vi.fn(async () => ({
    id: 1,
    name: "pastoria-city-area",
    pokemon_encounters: [
      { pokemon: { name: "tentacool", url: "" } },
      { pokemon: { name: "magikarp", url: "" } },
    ],
  }));

  await commandExplore(makeState({ pokeAPI: { fetchLocation } }), "pastoria-city-area");

  expect(fetchLocation).toHaveBeenCalledWith("pastoria-city-area");
  expect(lines).toEqual([
    "Exploring pastoria-city-area...",
    "Found Pokemon:",
    " - tentacool",
    " - magikarp",
  ]);
});

test("requires an area name", async () => {
  await expect(commandExplore(makeState())).rejects.toThrow("you must provide a location name");
});
