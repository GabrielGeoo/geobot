import { AttachmentBuilder, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import User from "../../models/User";
import { getUser } from "../../utils/get_info_from_command_or_message";
import getGeoguessrData from "../../utils/geoguessr_data/geoguessr_data";
import getLevelImage from "../../utils/geoguessr_data/level_image";

const levelCommand = new SlashCommandBuilder()
  .setName("level")
  .setDescription("Donnes le level d'un utilisateur ou de soi-même")
  .addUserOption(option => option.setName("user").setDescription("Utilisateur à qui chercher l'elo").setRequired(false));

const level = {
  data: levelCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    let user;
    if (interaction instanceof ChatInputCommandInteraction) {
      user = interaction.options.getUser("user") ?? interaction.user;
    } else {
      user = interaction.mentions.users.first() ?? interaction.author;
    }

    const dbUser = await User.findOne({ userId: user.id });
    if (!dbUser) {
      interaction.reply({
        content: user.id === getUser(interaction).id
          ? "Vous n'êtes pas enregistré. Utilisez la commande `!register <votre_lien_de_profil_geoguessr>`"
          : "Cet utilisateur n'est pas enregistré", ephemeral: true
      });
      return;
    }

    const data = await getGeoguessrData(dbUser.geoguessrId);
    const buffer = getLevelImage(data);

    const attachment = new AttachmentBuilder(buffer, { name: "level.png" });
    interaction.reply({ files: [attachment], ephemeral: true });
  }
};

export default level;