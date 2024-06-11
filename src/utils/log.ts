import { Client, EmbedBuilder, TextChannel } from "discord.js";

export default async function log(client: Client, title: string, desc: string) {
  if (!process.env.DEV) {
    const channel = await client.channels.fetch("1239550969021468682");
    if (channel instanceof TextChannel) {
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(desc)
        .setColor("#FF0000")
        .setTimestamp();

      channel.send({ embeds: [embed] });
    }
  }
}