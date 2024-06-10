import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import User from "../../models/User";
import { getDbUser, getUser } from "../../utils/get_info_from_command_or_message";

const registerCommand = new SlashCommandBuilder()
  .setName("register")
  .setDescription("Enregistre votre lien geoguessr")
  .addStringOption(option => option.setName("geoguessr_link").setDescription("Lien de votre compte geoguessr").setRequired(true));

const register = {
  data: registerCommand,
  transformOptionsToArgs(interaction: ChatInputCommandInteraction) {
    return [interaction.options.getString("geoguessr_link")!.toString()];
  },
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
    if (args.length === 0) {
      interaction.reply({ content: "Veuillez renseigner un lien geoguessr", ephemeral: true });
      return;
    }

    const geoguessrLink = args[0];
    const regex = /^(?:https:\/\/)?(?:www\.)?geoguessr\.com\/user\/([a-zA-Z0-9]{24})|([a-zA-Z0-9]{24})$/;
    const match = geoguessrLink.match(regex);
    const geoguessrId = match ? match[1] ?? match[2] : null;

    if (!geoguessrId) {
      interaction.reply({ content: "Lien geoguessr invalide", ephemeral: true });
      return;
    }

    const response = await fetch(`https://www.geoguessr.com/user/${geoguessrId}`);
    if (!response.ok) {
      interaction.reply({ content: "Lien geoguessr invalide", ephemeral: true });
      return;
    }

    const user = await getDbUser(interaction);
    const account = await User.findOne({ geoguessrId: geoguessrId });
    if (account) {
      if (user && user.userId === account.userId) interaction.reply({ content: "Ce compte geoguessr est déjà lié à votre compte", ephemeral: true });
      else interaction.reply({ content: "Ce compte geoguessr est déjà lié à @" + account.userId, ephemeral: true });
      return;
    }

    const isNew = user.geoguessrId == null;
    user.geoguessrId = geoguessrId;
    await user.save();
    if (!isNew) {
      await interaction.reply({ content: "Lien geoguessr mis à jour", ephemeral: true });
    } else {
      await interaction.reply({ content: "Lien geoguessr enregistré", ephemeral: true });
    }    
  }
};

export default register;