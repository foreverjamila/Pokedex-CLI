import { Cache } from "./pokecache.js";
import { test, expect, beforeEach, afterEach, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test.each([
  {
    key: "https://example.com",
    val: "testdata",
    interval: 500, // 1/2 second
  },
  {
    key: "https://example.com/path",
    val: "moretestdata",
    interval: 1000, // 1 second
  },
])("Test Caching $interval ms", ({ key, val, interval }) => {
  const cache = new Cache(interval);

  cache.add(key, val);
  const cached = cache.get(key);
  expect(cached).toBe(val);

  vi.advanceTimersByTime(interval * 2);
  const reaped = cache.get(key);
  expect(reaped).toBe(undefined);

  cache.stopReapLoop();
});

test("entry survives a reap before it expires", () => {
  const cache = new Cache(1000);
  cache.add("key", "value");

  // first reap runs at 1000 ms, when the entry is exactly 1000 ms old (not older)
  vi.advanceTimersByTime(1000);
  expect(cache.get("key")).toBe("value");

  cache.stopReapLoop();
});

test("missing key returns undefined", () => {
  const cache = new Cache(1000);
  expect(cache.get("https://nothing-here.com")).toBe(undefined);
  cache.stopReapLoop();
});
