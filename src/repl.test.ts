import { cleanInput } from "./repl.js";
import { describe, expect, test } from "vitest";

describe.each([
    {
        input: "  hello  world  ",
        expected: ["hello", "world"],
    },
    {
        input: "To romantisize the little things ",
        expected: ["to", "romantisize", "the", "little", "things"],
    },
    {
        input: "Charmander BULBASAUR PikaChu",
        expected: ["charmander", "bulbasaur", "pikachu"],
    },
    {
        input: " squirtle  eevee",
        expected: ["squirtle", "eevee"],
    },
    {
        input: "mewtwo",
        expected: ["mewtwo"],
    },
    {
        input: "   ",
        expected: [],
    },
])("cleanInput($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    const actual = cleanInput(input);

    // The `expect` and `toHaveLength` functions are from vitest
    // they will fail the test if the condition is not met
    expect(actual).toHaveLength(expected.length);
    for (const i in expected) {
      // likewise, the `toBe` function will fail the test if the values are not equal
      expect(actual[i]).toBe(expected[i]);
    }
  });
});