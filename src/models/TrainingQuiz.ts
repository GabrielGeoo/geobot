import { ButtonBuilder, ButtonStyle, MessageCreateOptions } from "discord.js";
import BaseQuiz from "./BaseQuiz";
import { QuizQuestion } from "./Quiz";
import { ActionRowBuilder } from "@discordjs/builders";

export class TrainingQuiz extends BaseQuiz<TrainingQuizQuestion> {

  getMessage(): MessageCreateOptions {
    const message = super.getMessage();
    const answerButton = new ButtonBuilder()
      .setCustomId("training-" + this.currentQuestion.getSendAnswer())
      .setLabel(this.currentQuestion.getSendAnswer())
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(answerButton);
    this.currentQuestion.badAnswers.forEach((badAnswer) => {
      const badAnswerButton = new ButtonBuilder()
        .setCustomId("training-" + badAnswer)
        .setLabel(badAnswer)
        .setStyle(ButtonStyle.Secondary);
      row.addComponents(badAnswerButton);
    });

    message.components = [row];
    return message;
  }
}

export class TrainingQuizQuestion extends QuizQuestion {
  public badAnswers: string[];

  constructor(answer: string, image: string, badAnswers: string[]) {
    super([answer], image);
    this.badAnswers = badAnswers;
  }
}