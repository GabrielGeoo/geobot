import { Client, ModalSubmitInteraction } from "discord.js";
import Pari from "../models/Pari";

module.exports = {
  name: ModalSubmitInteraction,
  type: "interaction",
  async execute(client: Client, interaction: ModalSubmitInteraction) {
    if (interaction.customId.startsWith("pari")) {
      const pari = interaction.customId.split("/").slice(1).join("/");
      const dbPari = await Pari.findOne({ pariName: pari });
      if (!dbPari) {
        return;
      }
      const bettors = dbPari.bettors;
      const bettor = bettors.find(bettor => bettor.userId === interaction.user.id);
      if (bettor) {
        bettor.bet = interaction.fields.getTextInputValue("bet");
      } else {
        bettors.push({
          userId: interaction.user.id,
          bet: interaction.fields.getTextInputValue("bet"),
        });
      }
      
      await dbPari.updateOne({ bettors });
      await interaction.reply({ content: "Pari enregistré avec succès!", ephemeral: true });
    }
  },
}