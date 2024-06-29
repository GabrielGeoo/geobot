import { Client, Events } from "discord.js";
import getFiles from "../utils/get_files";
import path from "path";

export default function registerEvents(client: Client): void {
  console.log("Registering events...");
  const eventFiles = getFiles(path.join(__dirname, "..", "events"), {extensions: [".ts", ".js"]});

  for (const eventFile of eventFiles) {
    const event = require(eventFile);
    switch (event.type) {
      case "interaction":
        client.on(Events.InteractionCreate, async (interaction) => {
          if (interaction instanceof event.name) {
            event.execute(client, interaction);
          }
        });
        break;
      case "once":
        client.once(event.name, (...args: any[]) => event.execute(...args));
        break;
      case "on":
        client.on(event.name, (...args: any[]) => event.execute(client, ...args));
        break;
      default:
        console.error(`Event ${eventFile} does not have a type!`);
        break;
    }
  }
  console.log("Successfully registered events!");
}