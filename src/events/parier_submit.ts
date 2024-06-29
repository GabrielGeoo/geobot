import { Client, ModalSubmitInteraction } from "discord.js";
import Pari from "../models/Pari";
import { getDbUser } from "../utils/get_info_from_command_or_message";

module.exports = {
  name: ModalSubmitInteraction,
  type: "interaction",
  async execute(client: Client, interaction: ModalSubmitInteraction) {
    if (interaction.customId.startsWith("pari")) {
      const coins = /^\d+$/.test(interaction.fields.getTextInputValue("coins")) ? parseInt(interaction.fields.getTextInputValue("coins"), 10) : NaN;
      if (isNaN(coins)) {
        await interaction.reply({ content: "Le nombre de coins doit être un nombre entier", ephemeral: true });
        return;
      }
      const dbUser = await getDbUser(interaction.user.id);
      if (dbUser.coins < coins) {
        await interaction.reply({ content: `Vous n'avez que ${dbUser.coins} coins. Vous ne pouvez pas parier ${coins} coins`, ephemeral: true });
        return;
      }
      const pari = interaction.customId.split("/").slice(1).join("/");
      const dbPari = await Pari.findOne({ pariName: pari });
      if (!dbPari) {
        return;
      }
      const bettors = dbPari.bettors;
      const bettor = bettors.find(bettor => bettor.userId === interaction.user.id);
      if (bettor) {
        bettor.bet = interaction.fields.getTextInputValue("bet");
        bettor.coins = coins;
      } else {
        bettors.push({
          userId: interaction.user.id,
          bet: interaction.fields.getTextInputValue("bet"),
          coins,
        });
      }
      
      await dbPari.updateOne({ bettors });
      await interaction.reply({ content: "Pari enregistré avec succès!", ephemeral: true });
    }
  },
}