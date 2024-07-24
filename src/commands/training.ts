import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";

const trainingCommand = new SlashCommandBuilder()
  .setName("training")
  .setDescription("Créer un quiz d'entraînement")
  .addStringOption(option =>
    option.setName("quiz").setDescription("Quiz d'entrainement").setRequired(true))
  .addNumberOption(option =>
    option.setMinValue(2).setMaxValue(4).setName("nb_answers").setDescription("Nombre de réponses proposés"))
  .addNumberOption(option =>
    option.setMinValue(1).setName("nb_questions").setDescription("Nombre de questions"))

const training = {
  data: trainingCommand,
  transformOptionsToArgs(interaction: ChatInputCommandInteraction) {
    return [interaction.options.getString("quiz"), interaction.options.getNumber("nb_answers") ?? 4, interaction.options.getNumber("nb_questions") ?? 1];
  },
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {

  }
};

export default training;