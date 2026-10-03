import type { State } from "./state.js";

export async function commandPokedex(state: State) {
    console.log("Your Pokedex:");
    for (const name of Object.keys(state.pokedex)) {
        console.log(` - ${name}`);
    }
}
