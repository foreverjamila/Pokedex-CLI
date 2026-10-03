import { readFileSync, writeFileSync } from "node:fs";
import type { Pokemon } from "./pokeapi.js";

export function loadPokedex(path: string): Record<string, Pokemon> {
    let text: string;
    try {
        text = readFileSync(path, "utf-8");
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
            return {};
        }
        throw err;
    }

    try {
        return JSON.parse(text);
    } catch {
        console.log(`Warning: could not read ${path}, starting with an empty Pokedex`);
        return {};
    }
}

export function savePokedex(path: string, pokedex: Record<string, Pokemon>) {
    writeFileSync(path, JSON.stringify(pokedex, null, 2));
}
