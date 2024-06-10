import { AttachmentBuilder, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { getDbUser, getUser } from "../../utils/get_info_from_command_or_message";
import getGeoguessrData from "../../utils/geoguessr_data/geoguessr_data";
import getLevelImage from "../../utils/geoguessr_data/level_image";

const levelCommand = new SlashCommandBuilder()
  .setName("level")
  .setDescription("Donnes le level d'un utilisateur ou de soi-même")
  .addUserOption(option => option.setName("user").setDescription("Utilisateur à qui chercher l'elo").setRequired(false));

const level = {
  data: levelCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    const user = await getDbUser(interaction);

    if (user) {
      if (!user.geoguessrId) {
        await interaction.reply({
          content: user.userId === getUser(interaction).id
            ? "Vous n'êtes pas enregistré. Utilisez la commande `!register <votre_lien_de_profil_geoguessr>`"
            : "Cet utilisateur n'est pas enregistré", ephemeral: true
        });
        return;
      }
      const data = await getGeoguessrData(user.geoguessrId);
      const buffer = getLevelImage(data);
  
      const attachment = new AttachmentBuilder(buffer, { name: "level.png" });
      interaction.reply({ files: [attachment], ephemeral: true });
    }
  }
};

export default level;