
import type { State } from "./state.js";

export function cleanInput(input: string): string[] {
  return input
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "");
}

export function startREPL(state: State) {
  const { rl, commands } = state;

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
      cmd.callback(state);
    } catch (err) {
      console.log(err);
    }
    
    rl.prompt();
  });
}
