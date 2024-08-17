import { ButtonInteraction, Client } from "discord.js";
import QuizHandler from "../handler/quiz_handler";
import { TrainingQuiz } from "../models/TrainingQuiz";
import log from "../utils/log";

module.exports = {
  name: ButtonInteraction,
  type: "interaction",
  async execute(client: Client, interaction: ButtonInteraction) {
    if (interaction.customId.startsWith("training")) {
      const quiz = QuizHandler.getInstance().getQuiz(interaction.channelId) as TrainingQuiz;
      if (!quiz) {
        log(client, "Interaction Exception", "No quiz found in channel " + interaction.channelId);
        return;
      }
      
      const answer = interaction.customId.split("-")[1];
      quiz.updateComponents(interaction, answer);
      if (quiz.isCorrectAnswer(answer)) {
        interaction.channel?.send("Bonne réponse !");
        quiz.addPoint(interaction.user.id);
        quiz.doAfterGoodAnswer(interaction);
        await quiz.nextQuestion(interaction);
      }
    }
  },
}