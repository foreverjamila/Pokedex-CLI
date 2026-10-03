import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import type { CLICommand } from "./state.js";
import { commandMap, commandMapBack } from "./command_map.js";
import { commandExplore } from "./command_explore.js";
import { commandCatch } from "./command_catch.js";


export function getCommands(): Record<string, CLICommand> {
    return{
        help: {
            name: "help",
            description: "Displays a help message",
            callback: commandHelp,
        },
        exit: {
            name: "exit",
            description: "Exit the Pokedex",
            callback: commandExit,
        },
        map: {
            name: "map",
            description: "Display the next 20 location areas",
            callback: commandMap,
        },
        mapb: {
            name: "mapb",
            description: "Display the previous 20 location areas",
            callback: commandMapBack,
        },
        explore: {
            name: "explore",
            description: "Explore a location area to find Pokemon",
            callback: commandExplore,
        },
        catch: {
            name: "catch",
            description: "Try to catch a Pokemon and add it to your Pokedex",
            callback: commandCatch,
        },
    };

}