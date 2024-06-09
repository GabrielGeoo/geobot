import { APIApplicationCommandSubcommandGroupOption, ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import commands from "../utils/get_commands";
import config from '../../assets/config.json';

const helpCommand = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Affiches les commandes disponibles")
  .addStringOption(option => option
    .setName("command")
    .setDescription("Commande à afficher")
    .setRequired(false)
  );

const help = {
  data: helpCommand,
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
    let embed;
    if (args.length > 0) {
      const command = commands.get().find(c => c.data.name === args[0]);
      if (!command) {
        interaction.reply({ content: "Commande inconnue", ephemeral: true });
        return;
      }
      embed = new EmbedBuilder()
        .setTitle(command.data.name)
        .addFields([
          {
            name: "Description",
            value: command.data.description,
          },
          {
            name: "Utilisation",
            value: getUseCommand(command.data),
          }
        ]);
    } else {
      embed = new EmbedBuilder()
        .addFields([
          {
            name: "Liste des commandes",
            value: commands.get().filter(c => !c.quizCommand).map((command) => getStringCommand(command.data)).join("\n"),
          },
          {
            name: "Liste des quiz",
            value: commands.get().filter(c => c.quizCommand).map((command) => getStringCommand(command.data)).join("\n"),
          }
        ]);
    }
    embed.setColor("#FF0000");
    interaction.reply({ embeds: [embed] });
  }
};

export default help;

function getStringCommand(command: SlashCommandBuilder) {
  if (command.options.length > 0 && command.options[0] instanceof SlashCommandSubcommandBuilder) {
    return command.toJSON().options!.map(option => `\`${config.prefix + command.name} ${option.name}\` - ${option.description}`).join("\n");
  }
  return `\`${config.prefix + command.name}\` - ${command.description}`
}

function getUseCommand(command: SlashCommandBuilder) {
  const options = command.toJSON().options!;
  if (command.options.length > 0 && command.options[0] instanceof SlashCommandSubcommandBuilder) {
    let result = "";
    for (let option of options) {
      option = option as APIApplicationCommandSubcommandGroupOption;
      let temp = config.prefix + command.name + " " + option.name;
      for (const suboption of option.options!) {
        temp += ` ${suboption.required ? "<" : "["}${suboption.name}${suboption.required ? ">" : "]"}`;
      }
      result += `${temp}\n`;
    }
    return result;
  } else {
    let result = config.prefix + command.name;
    for (const option of options) {
      result += ` ${option.required ? "<" : "["}${option.name}${option.required ? ">" : "]"}`;
    }
    return result;
  }
}