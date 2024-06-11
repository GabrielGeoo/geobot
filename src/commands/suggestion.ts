import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import Suggestion from "../models/Suggestion";
import { getUser } from "../utils/get_info_from_command_or_message";

const suggestionCommand = new SlashCommandBuilder()
  .setName("suggestion")
  .setDescription("Donner une suggestion pour améliorer le bot")
  .addStringOption(option =>
    option.setName("suggestion")
      .setDescription("La suggestion à donner")
      .setRequired(false)
  );

const suggestion = {
  data: suggestionCommand,
  transformOptionsToArgs: (interaction: ChatInputCommandInteraction) => {
    return [interaction.options.getString("suggestion") ?? ""];
  },
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
    if (args.length > 0 && args[0].length > 0) {
      await Suggestion.create({
        userId: getUser(interaction).id,
        suggestion: args.join(" "),
      });
      await interaction.reply("Merci pour votre suggestion !");
    } else {
      const suggestions = await Suggestion.find();
      if (suggestions.length === 0) {
        await interaction.reply("Il n'y a pas de suggestions pour le moment");
        return;
      }
      const embed = new EmbedBuilder()
        .setTitle("Suggestions")
        .setDescription(suggestions.map(s => `- ${s.suggestion}`).join("\n"));
      await interaction.reply({ embeds: [embed] });
    }
  }
};

export default suggestion;