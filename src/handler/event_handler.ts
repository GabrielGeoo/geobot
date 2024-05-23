import { Client } from "discord.js";
import getFiles from "../utils/get_files";
import path from "path";

export default function registerEvents(client: Client): void {
  console.log("Registering events...");
  const eventFiles = getFiles(path.join(__dirname, "..", "events"));

  for (const eventFile of eventFiles) {
    const event = require(eventFile);
    if (event.once) {
      client.once(event.name, (...args: any[]) => event.execute(...args));
    } else {
      client.on(event.name, (...args: any[]) => event.execute(client, ...args));
    }
  }
  console.log("Successfully registered events!");
}