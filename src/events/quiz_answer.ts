import { Client, Events, Message } from "discord.js";
import QuizHandler from "../handler/quiz_handler";
import getConfig from "../utils/get_config";

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(client: Client, message: Message) {
    if (message.author.bot) return;
    const quiz = QuizHandler.getInstance().getQuiz(message.channel.id);
    if (!quiz || quiz.waitingQuestion) return;

    if (quiz.isCorrectAnswer(message.content)) {
      message.react('✅');
      quiz.addPoint(message.author.id);
      await quiz.nextQuestion(message);
    } else {
      const config = await getConfig();
      if (message.content.startsWith(config.prefix)) return;
      message.react('❌');
    }
  },
}