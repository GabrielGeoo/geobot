import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import getUser from "../utils/get_info_from_command_or_message";
import User from "../models/User";

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

    const find = await User.findOne({ userId: getUser(interaction).id });
    if (find) {
      await User.updateOne({ userId: getUser(interaction).id }, { geoguessrId });
      interaction.reply({ content: "Lien geoguessr mis à jour", ephemeral: true });
    } else {
      await User.create({ userId: getUser(interaction).id, geoguessrId });
      interaction.reply({ content: "Lien geoguessr enregistré", ephemeral: true });
    }    
  }
};

export default register;