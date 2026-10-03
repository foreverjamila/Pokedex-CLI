import { createInterface, type Interface } from "node:readline";
import { getCommands } from "./command.js";
import { PokeAPI, type Pokemon } from "./pokeapi.js";


export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
    rl: Interface;
    commands: Record<string, CLICommand>;
    pokeAPI: PokeAPI;
    nextLocationURL: string | null;
    prevLocationURL: string | null;
    pokedex: Record<string, Pokemon>;
};

export function initState(): State {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "Pokedex >",
    });

    return {
        rl,
        commands: getCommands(),
        pokeAPI: new PokeAPI(1000 * 60 * 5),
        nextLocationURL: null,
        prevLocationURL: null,
        pokedex: {},
    };
}