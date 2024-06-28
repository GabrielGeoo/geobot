import { ActionRowBuilder, ButtonInteraction, Client, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Pari from "../models/Pari";

module.exports = {
  name: ButtonInteraction,
  type: "interaction",
  async execute(client: Client, interaction: ButtonInteraction) {
    if (interaction.customId.startsWith("pari")) {
      const pari = interaction.customId.split("/").slice(1).join("/");
      const dbPari = await Pari.findOne({ pariName: pari });
      if (!dbPari) {
        return;
      }
      const bettor = dbPari.bettors.find(bettor => bettor.id === interaction.user.id);
      const modal = new ModalBuilder()
        .setCustomId(interaction.customId)
        .setTitle(pari.slice(0, 42));
      
      const input = new TextInputBuilder()
        .setCustomId('bet')
        .setLabel("Inscrivez votre pari")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);
  
      if (bettor) {
        input.setValue(bettor.bet);
      }
      const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input);
  
      modal.addComponents(firstActionRow);
      
      await interaction.showModal(modal);
    }
  },
}