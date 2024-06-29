import { ActivityType, Client, EmbedBuilder, Events, TextChannel } from "discord.js";
import log from "../utils/log";

module.exports = {
  name: Events.ClientReady,
  type: "once",
  async execute(client: Client) {
    log(client, "Bot is ready!", "Bot is now online and ready to serve!");
    client.user?.setActivity({
      name: "!flags | !help",
      type: ActivityType.Playing,
    });
  },
}