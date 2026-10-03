import { expect, test } from "vitest";
import { commandPokedex } from "./command_pokedex.js";
import { PIDGEY, captureLogs, makeState } from "./test_helpers.js";

test("lists caught pokemon in the order they were caught", async () => {
  const lines = captureLogs();
  const caterpie = { ...PIDGEY, id: 10, name: "caterpie" };
  await commandPokedex(makeState({ pokedex: { pidgey: PIDGEY, caterpie } }));
  expect(lines).toEqual(["Your Pokedex:", " - pidgey", " - caterpie"]);
});

test("an empty pokedex prints only the header", async () => {
  const lines = captureLogs();
  await commandPokedex(makeState());
  expect(lines).toEqual(["Your Pokedex:"]);
});
