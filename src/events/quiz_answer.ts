import { Client, Events, Message } from "discord.js";
import QuizHandler from "../handler/quiz_handler";

module.exports = {
  name: Events.MessageCreate,
  once: false,
  execute(client: Client, message: Message) {
    if (message.author.bot) return;
    const quiz = QuizHandler.getInstance().getQuiz(message.channel.id);
    if (!quiz) return;

    if (quiz.isCorrectAnswer(message.content)) {
      message.react('✅');
      quiz.addPoint(message.author.id);
      quiz.nextQuestion(message);
    } else {
      message.react('❌');
    }
  },
}