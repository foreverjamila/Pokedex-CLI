import type { State } from "./state.js";

export async function commandCatch(state: State, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("you must provide a pokemon name");
    }

    const name = args[0];
    console.log(`Throwing a Pokeball at ${name}...`);

    const pokemon = await state.pokeAPI.fetchPokemon(name);

    const catchChance = 100 / (pokemon.base_experience + 100);
    if (Math.random() >= catchChance) {
        console.log(`${name} escaped!`);
        return;
    }

    console.log(`${name} was caught!`);
    console.log("You may now inspect it with the inspect command.");
    state.pokedex[name] = pokemon;
}
