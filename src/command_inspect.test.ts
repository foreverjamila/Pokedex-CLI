import { expect, test } from "vitest";
import { commandInspect } from "./command_inspect.js";
import { PIDGEY, captureLogs, makeState } from "./test_helpers.js";

test("a pokemon that hasn't been caught can't be inspected", async () => {
  const lines = captureLogs();
  await commandInspect(makeState(), "pidgey");
  expect(lines).toEqual(["you have not caught that pokemon"]);
});

test("a caught pokemon prints its details", async () => {
  const lines = captureLogs();
  await commandInspect(makeState({ pokedex: { pidgey: PIDGEY } }), "pidgey");
  expect(lines).toEqual([
    "Name: pidgey",
    "Height: 3",
    "Weight: 18",
    "Stats:",
    "  -hp: 40",
    "  -attack: 45",
    "  -defense: 40",
    "  -special-attack: 35",
    "  -special-defense: 35",
    "  -speed: 56",
    "Types:",
    "  - normal",
    "  - flying",
  ]);
});
