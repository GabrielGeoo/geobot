import { ChatInputCommandInteraction, Message, SlashCommandBuilder, TextChannel } from "discord.js";
import QuizManager from "../handler/quiz_handler";

const stopCommand = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Arrête le quiz");

const stop = {
  data: stopCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    const quiz = QuizManager.getInstance().getQuiz(interaction.channelId);
    if (quiz) {
      (interaction.channel as TextChannel)?.send(`Quiz arrêté ! La réponse était: ${quiz.answer}`);
      quiz.finishQuiz(interaction);
    } else {
      await interaction.reply({ content: "Aucun quiz en cours dans ce channel", ephemeral: true });
    }
  }
};

export default stop;