import { Client, Events, Message } from "discord.js";
import QuizHandler from "../handler/quiz_handler";
import getConfig from "../utils/get_config";

module.exports = {
  name: Events.MessageCreate,
  type: "on",
  async execute(client: Client, message: Message) {
    if (message.author.bot) return;
    const quiz = QuizHandler.getInstance().getQuiz(message.channel.id);
    if (!quiz || (quiz.time.seconds == 0 && quiz.time.secondTenths == 0)) return;

    quiz.resetAfkQuestion();
    if (quiz.isCorrectAnswer(message.content)) {
      message.react('✅');
      quiz.addPoint(message.author.id);
      await quiz.sendMessageAfterGoodAnswer(message);
      await quiz.nextQuestion(message);
    } else {
      const config = await getConfig();
      if (message.content.startsWith(config.prefix)) return;
      message.react('❌');
    }
  },
}