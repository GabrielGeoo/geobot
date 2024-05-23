import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import QuizManager from "../handler/quiz_handler";

const skipCommand = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Passes la question du quiz");

const flags = {
  data: skipCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    const quiz = QuizManager.getInstance().getQuiz(interaction.channelId);
    if (quiz) {
      await interaction.reply(`Question passé. La réponse était: ${quiz.answer}`);
      quiz.nextQuestion(interaction);
      
    } else {
      await interaction.reply({ content: "Vous n'avez pas de quiz en cours", ephemeral: true });
    }
  }
};

export default flags;