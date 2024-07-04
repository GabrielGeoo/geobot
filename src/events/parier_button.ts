import { ActionRowBuilder, ButtonInteraction, Client, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Pari from "../models/database/Pari";
import User from "../models/database/User";
import { getDbUser } from "../utils/get_info_from_command_or_message";

module.exports = {
  name: ButtonInteraction,
  type: "interaction",
  async execute(client: Client, interaction: ButtonInteraction) {
    if (interaction.customId.startsWith("pari")) {
      const dbUser = await getDbUser(interaction.user.id);
      if (dbUser.coins <= 0) {
        interaction.reply({ content: "Vous n'avez pas assez de coins pour parier", ephemeral: true });
        return;
      }
      const pari = interaction.customId.split("/").slice(1).join("/");
      const dbPari = await Pari.findOne({ pariName: pari });
      if (!dbPari) {
        return;
      }
      const bettor = dbPari.bettors.find(bettor => bettor.userId === interaction.user.id);
      const modal = new ModalBuilder()
        .setCustomId(interaction.customId)
        .setTitle(pari.slice(0, 42));
      
      const input = new TextInputBuilder()
        .setCustomId('bet')
        .setLabel("Inscrivez votre pari")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      const coinsInput = new TextInputBuilder()
        .setCustomId('coins')
        .setLabel(`Nombre de coins à parier (max: ${dbUser.coins})`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short);


      if (bettor) {
        input.setValue(bettor.bet);
        coinsInput.setValue(bettor.coins.toString());
      }
      const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input);
      const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(coinsInput);
  
      modal.addComponents(firstActionRow, secondActionRow);
      
      await interaction.showModal(modal);
    }
  },
}