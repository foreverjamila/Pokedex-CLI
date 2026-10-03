import { afterEach, expect, test, vi } from "vitest";
import { PokeAPI } from "./pokeapi.js";
import { PIDGEY } from "./test_helpers.js";

let api: PokeAPI;

function stubFetch(response: { ok: boolean; status?: number; statusText?: string; body?: unknown }) {
  const fetchMock = vi.fn(async () => ({
    ok: response.ok,
    status: response.status ?? 200,
    statusText: response.statusText ?? "OK",
    json: async () => response.body,
  }));
  vi.stubGlobal("fetch", fetchMock);
  api = new PokeAPI(60_000);
  return fetchMock;
}

afterEach(() => {
  api.closeCache();
});

test("fetchPokemon keeps only the fields the app uses", async () => {
  stubFetch({ ok: true, body: { ...PIDGEY, moves: ["gust"], sprites: { front: "x" } } });

  const pokemon = await api.fetchPokemon("pidgey");

  expect(pokemon).toEqual(PIDGEY);
  expect(pokemon).not.toHaveProperty("moves");
});

test("fetchPokemon uses the cache for repeat requests", async () => {
  const fetchMock = stubFetch({ ok: true, body: PIDGEY });

  await api.fetchPokemon("pidgey");
  await api.fetchPokemon("pidgey");

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/pidgey");
});

test("fetchPokemon throws on an error response", async () => {
  stubFetch({ ok: false, status: 404, statusText: "Not Found" });

  await expect(api.fetchPokemon("missingno")).rejects.toThrow(
    "Error fetching pokemon 'missingno': 404 Not Found",
  );
});

test("fetchLocations starts at the first page", async () => {
  const fetchMock = stubFetch({ ok: true, body: { count: 0, next: null, previous: null, results: [] } });

  await api.fetchLocations();

  expect(fetchMock).toHaveBeenCalledWith("https://pokeapi.co/api/v2/location-area");
});
