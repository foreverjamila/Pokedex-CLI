import type { State } from "./state.js";
import { savePokedex } from "./storage.js";

const BALLS: Record<string, { label: string; multiplier: number }> = {
    pokeball: { label: "a Pokeball", multiplier: 1 },
    greatball: { label: "a Great Ball", multiplier: 1.5 },
    ultraball: { label: "an Ultra Ball", multiplier: 2 },
};

export function catchChance(baseExperience: number, multiplier: number): number {
    return Math.min(1, (multiplier * 100) / (baseExperience + 100));
}

export async function commandCatch(state: State, ...args: string[]) {
    if (args.length < 1 || args.length > 2) {
        throw new Error("usage: catch <pokemon> [pokeball|greatball|ultraball]");
    }

    const [name, ballName = "pokeball"] = args;
    if (!Object.hasOwn(BALLS, ballName)) {
        throw new Error(`unknown ball '${ballName}' (use pokeball, greatball or ultraball)`);
    }
    const ball = BALLS[ballName];

    console.log(`Throwing ${ball.label} at ${name}...`);

    const pokemon = await state.pokeAPI.fetchPokemon(name);

    if (Math.random() >= catchChance(pokemon.base_experience, ball.multiplier)) {
        console.log(`${name} escaped!`);
        return;
    }

    console.log(`${name} was caught!`);
    console.log("You may now inspect it with the inspect command.");
    state.pokedex[name] = pokemon;
    savePokedex(state.pokedexPath, state.pokedex);
}
