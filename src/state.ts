import { createInterface, type Interface } from "node:readline";
import { getCommands } from "./command.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => void;
};

export type State = {
    rl: Interface;
    commands: Record<string, CLICommand>;
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
    };
}