import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import getGeoguessrData from "../../utils/geoguessr_data/geoguessr_data";
import getLevelImage from "../../utils/geoguessr_data/level_image";
import getRankData from "../../utils/geoguessr_data/rank_data";
import { getDbUser, getUser } from "../../utils/get_info_from_command_or_message";

const profilCommand = new SlashCommandBuilder()
  .setName("profil")
  .setDescription("Donnes le profil geoguessr d'un utilisateur ou de soi-même")
  .addUserOption(option => option.setName("user").setDescription("Utilisateur à qui chercher le profil").setRequired(false));

const profil = {
  data: profilCommand,
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
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

      const url = "https://www.geoguessr.com/images/gravity:ce/plain/" + data.user.pin.url;
      const buffer = getLevelImage(data);
      const attachment = new AttachmentBuilder(buffer, { name: "level.png" });
  
      const rankData = await getRankData(data, user, interaction.client);
  
      const guild = await interaction.client.guilds.fetch("728006388936081528");
      const creatorEmoji = data.user.isCreator ? guild.emojis.cache.get("1248754956891066389") : "";
      const verifiedEmoji = data.user.isVerified ? guild.emojis.cache.get("1248754481324101692") : "";
  
      const embed = new EmbedBuilder()
        .setTitle(`Profil de ${data.user.nick} ${verifiedEmoji} ${creatorEmoji}`)
        .setDescription(rankData)
        .setThumbnail(url)
        .setColor("#2ECC71")
        .setImage("attachment://level.png")
        .setTimestamp(new Date(data.user.created))
        
      interaction.reply({ embeds: [embed], files: [attachment], ephemeral: true});
    }
  }
};

export default profil;