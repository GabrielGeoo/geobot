import { AttachmentBuilder, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import User from "../../models/User";
import { getDbUser, getUser } from "../../utils/get_info_from_command_or_message";
import getGeoguessrData from "../../utils/geoguessr_data/geoguessr_data";

const avatarCommand = new SlashCommandBuilder()
  .setName("avatar")
  .setDescription("Donnes l'avatar d'un utilisateur ou de soi-même")
  .addUserOption(option => option.setName("user").setDescription("Utilisateur à qui chercher l'avatar").setRequired(false))
  .addBooleanOption(option => option.setName("full").setDescription("Si oui, envoi l'avatar en entier").setRequired(false));

const avatar = {
  data: avatarCommand,
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
    const user = await getDbUser(interaction);
    if (user) {
      let full = false;
      if (interaction instanceof ChatInputCommandInteraction) {
        full = interaction.options.getBoolean("full") ?? false;
      } else {
        full = args.includes("full") || args.includes("true");
      }
  
      if (!user.geoguessrId) {
        await interaction.reply({
          content: user.userId === getUser(interaction).id
            ? "Vous n'êtes pas enregistré. Utilisez la commande `!register <votre_lien_de_profil_geoguessr>`"
            : "Cet utilisateur n'est pas enregistré", ephemeral: true
        });
        return;
      }
  
      const data = await getGeoguessrData(user.geoguessrId);
      const pinUrl = full ? data.user.fullBodyPin : data.user.pin.url;
      const url = "https://www.geoguessr.com/images/gravity:ce/plain/" + pinUrl;
      const attachment = new AttachmentBuilder(url, { name: "avatar.png" });
      interaction.reply({ files: [attachment], ephemeral: true });
    }
  }
};

export default avatar;