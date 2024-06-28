import { ButtonInteraction, Client, GuildMember, ModalSubmitInteraction, PermissionFlagsBits } from "discord.js";
import Pari from "../models/Pari";

module.exports = {
  name: ButtonInteraction,
  type: "interaction",
  async execute(client: Client, interaction: ButtonInteraction) {
    if (interaction.customId.startsWith("deletePari")) {
      // check if user has admin permission 
      const guildMember = interaction.member as GuildMember;
      if (!guildMember.permissions.has(PermissionFlagsBits.Administrator)) {
        interaction.reply("Vous n'avez pas la permission d'exécuter cette commande");
        return;
      }

      const pari = interaction.customId.split("/").slice(1).join("/");
      const dbPari = await Pari.findOne({ pariName: pari });
      if (!dbPari) {
        return;
      }
      await dbPari.deleteOne();
      interaction.reply({ content: `Le pari "${pari}" a été supprimé`, ephemeral: true });
    }
  },
}