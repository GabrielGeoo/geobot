import { ButtonInteraction, Client } from "discord.js";

module.exports = {
  name: ButtonInteraction,
  type: "interaction",
  async execute(client: Client, interaction: ButtonInteraction) {
    if (interaction.customId.startsWith("DISABLED")) {
      interaction.deferUpdate();
    }
  },
}