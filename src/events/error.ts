import { Client, EmbedBuilder, Events, TextChannel } from "discord.js";
import log from "../utils/log";

module.exports = {
  name: Events.Error,
  type: "once",
  async execute(client: Client, error: Error) {
    log(client, "Une erreur est apparu", error.message);
  },
}