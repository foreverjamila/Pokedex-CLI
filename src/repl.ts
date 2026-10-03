import { createInterface } from "node:readline";
import { getCommands } from "./command.js";


export function cleanInput(input: string): string[] {
  return input
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "");
}

export function startREPL() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Pokedex > ",
  });

  const commands = getCommands();

  rl.prompt();

  rl.on("line", (input) => {
    const words = cleanInput(input);
    if (words.length === 0) {
      rl.prompt();
      return;
    }
    const commandName = words[0];
    const cmd = commands[commandName];

    if (!cmd) {
      console.log("Unknown command");
      rl.prompt();
      return;
    }

    try {
      cmd.callback(commands);
    } catch (err) {
      console.log(err);
    }
    
    rl.prompt();
  });
}
