import { Client, EmbedBuilder, Events, TextChannel } from "discord.js";
import log from "../utils/log";

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    log(client, "Bot is ready!", "Bot is now online and ready to serve!");
  },
}