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
      if (args[0] === "quiz") {
        embed = new EmbedBuilder()
        .setTitle("Liste des quiz")
        .setDescription(commands.get().filter(c => c.quizCommand).map((command) => getStringCommand(command.data)).join("\n"));
      } else {
        const command = commands.get().find(c => c.data.name === args[0]);
        if (!command) {
          interaction.reply({ content: "Commande inconnue", ephemeral: true });
          return;
        }
        embed = new EmbedBuilder()
          .setTitle(config.prefix + command.data.name)
          .addFields([
            {
              name: "Description",
              value: command.data.description,
            },
            {
              name: "Utilisation",
              value: command.helpUtilisation ?? getUseCommand(command.data),
            }
          ]);
      }
    } else {
      const commandsString = commands.get().filter(c => !c.quizCommand).map((command) => getStringCommand(command.data)).join("\n");
      const lengthSeparated = Math.ceil(commandsString.length / 1024);
      const quizString = commands.get().filter(c => c.quizCommand).map((command) => getStringCommand(command.data)).join("\n");
      const lengthSeparatedQuiz = Math.ceil(quizString.length / 1024);

      embed = new EmbedBuilder()
        .addFields(splitArray(commands.get().filter(c => !c.quizCommand), lengthSeparated).map((commands, index) => {
          return {
            name: index == 0 ? `Liste des commandes` : "\u200b",
            value: commands.map((command) => getStringCommand(command.data)).join("\n"),
          }
        }))
        .addFields(splitArray(commands.get().filter(c => c.quizCommand), lengthSeparatedQuiz).map((commands, index) => {
          return {
            name: index == 0 ? `Liste des quiz` : "\u200b",
            value: commands.map((command) => getStringCommand(command.data)).join("\n"),
          }
        }))
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

function splitArray<T>(array: T[], n: number): T[][] {
  const result: T[][] = [];
  const minSize = Math.floor(array.length / n);
  const extra = array.length % n; // le nombre de tableaux qui auront un élément en plus

  let start = 0;
  for (let i = 0; i < n; i++) {
    const size = i < extra ? minSize + 1 : minSize;
    result.push(array.slice(start, start + size));
    start += size;
  }

  return result;
}
