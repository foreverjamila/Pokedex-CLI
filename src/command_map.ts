import { State } from "./state.js";

export async function commandMap(state: State) {
    const page = await state.pokeAPI.fetchLocations(state.nextLocationURL ?? undefined);

    state.nextLocationURL = page.next;
    state.prevLocationURL = page.previous;

    for (const location of page.results) {
        console.log(location.name);
    }
}

export async function commandMapBack(state: State) {
    if (!state.prevLocationURL) {
        console.log("you're on the first page");
        return;
    }

    const page = await state.pokeAPI.fetchLocations(state.prevLocationURL);
    state.nextLocationURL = page.next;
    state.prevLocationURL = page.previous;

    for (const location of page.results) {
        console.log(location.name);
        
    }
}