import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import commands from "../utils/get_commands";
import config from '../../assets/config.json';

const helpCommand = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Affiches les commandes disponibles");

const help = {
  data: helpCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    const embed = new EmbedBuilder()
      .addFields([
        {
          name: "Liste des commandes",
          value: commands.get().filter(c => !c.quizCommand).map((command) => `\`${config.prefix + command.data.name}\` - ${command.data.description}`).join("\n"),
        },
        {
          name: "Liste des quiz",
          value: commands.get().filter(c => c.quizCommand).map((command) => `\`${config.prefix + command.data.name}\` - ${command.data.description}`).join("\n"),
        }
      ])
      .setColor("#FF0000");

    interaction.reply({ embeds: [embed] });
  }
};

export default help;