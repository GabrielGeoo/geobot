import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, ComponentType, EmbedBuilder, TextChannel } from "discord.js";

export default async function log(client: Client, title: string, desc: string, temp = false) {
  if (!process.env.DEV) {
    const channel = await client.channels.fetch("1239550969021468682");
    if (channel instanceof TextChannel) {
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(desc)
        .setColor("#0000FF")
        .setTimestamp();
      const row = new ActionRowBuilder<ButtonBuilder>()
      if (temp) {
        row.addComponents(new ButtonBuilder().setCustomId("delete_log").setLabel("Supprimer").setStyle(ButtonStyle.Danger));
        embed.setFooter({text: "Ce message sert de debug et sera supprimé dans maximum 20 minutes."});
      }

      const response = await channel.send({ embeds: [embed], components: [row] });

      if (temp) {
        try {
          const buttonResponse = await response.awaitMessageComponent({ componentType: ComponentType.Button, time: 1000 * 60 * 20 });
          if (buttonResponse.customId === "delete_log") {
            await response.delete();
          } else {
            console.error("Invalid button response");
          }
        } catch (e) {
          await response.delete();
        }
      }
    }
  }
  return null;
}