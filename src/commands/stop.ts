import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import QuizManager from "../handler/quiz_handler";

const stopCommand = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Arrête le quiz");

const flags = {
  data: stopCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    const quiz = QuizManager.getInstance().getQuiz(interaction.channelId);
    if (quiz) {
      quiz.finishQuiz(interaction);
    } else {
      await interaction.reply({ content: "Aucun quiz en cours dans ce channel", ephemeral: true });
    }
  }
};

export default flags;