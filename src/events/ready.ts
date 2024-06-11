import { Client, EmbedBuilder, Events, TextChannel } from "discord.js";

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log(`Logged in as ${client.user?.tag}!`);
    if (!process.env.DEV) {
      const channel = await client.channels.fetch("1239550969021468682");
      if (channel instanceof TextChannel) {
        const embed = new EmbedBuilder()
          .setTitle("Bot is online!")
          .setDescription("Bot is online and ready to serve!")
          .setColor("#FF0000")
          .setTimestamp();
      }
    }
  },
}