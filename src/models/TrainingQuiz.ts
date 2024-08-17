import { ButtonBuilder, ButtonInteraction, ButtonStyle, MessageComponentInteraction, MessageCreateOptions } from "discord.js";
import BaseQuiz from "./BaseQuiz";
import { QuizQuestion } from "./Quiz";
import { ActionRowBuilder } from "@discordjs/builders";

export class TrainingQuiz extends BaseQuiz<TrainingQuizQuestion> {

  private currentButtons: ButtonBuilder[] = [];

  override getMessage(): MessageCreateOptions {
    const message = super.getMessage();
    message.components = [this.getComponents()];
    return message;
  }

  override async doAfterGoodAnswer(interaction: ButtonInteraction): Promise<void> {
    this.currentButtons = [];
  }

  public updateComponents(interaction: MessageComponentInteraction, answer: string): void {
    if (this.isCorrectAnswer(answer)) {
      this.currentButtons.find((button) => button.toJSON().label === this.normalizeStringForUser(answer))?.setStyle(ButtonStyle.Success);
      this.currentButtons.forEach((button) => button.setCustomId("DISABLED-" + button.toJSON().label));
    } else {
      this.currentButtons.find((button) => button.toJSON().label === this.normalizeStringForUser(answer))?.setStyle(ButtonStyle.Danger);
    }
    interaction.update({
      content: this.getMessage().content,
      components: [this.getComponents()],
    });
  }

  private getComponents(): ActionRowBuilder<ButtonBuilder> {
    if (this.currentButtons.length === 0) {
      const answerButton = new ButtonBuilder()
        .setCustomId(`training-${this.answer}`)
        .setLabel(this.normalizeStringForUser(this.answer))
        .setStyle(ButtonStyle.Secondary);
      this.currentButtons.push(answerButton);

      this.currentQuestion.badAnswers.forEach((badAnswer) => {
        const badAnswerButton = new ButtonBuilder()
          .setCustomId(`training-${badAnswer}`)
          .setLabel(this.normalizeStringForUser(badAnswer))
          .setStyle(ButtonStyle.Secondary);
          this.currentButtons.push(badAnswerButton);
      });

      this.currentButtons.sort(() => Math.random() - 0.5);
    }
    console.log(this.currentButtons);
    const row = new ActionRowBuilder<ButtonBuilder>();
    row.addComponents(this.currentButtons);
    return row;
  }

  private normalizeStringForUser(str: string): string {
    str = str.replaceAll("_", " ");
    str = str.charAt(0).toUpperCase() + str.slice(1);
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) === " " || str.charAt(i) === "-") {
        str = str.slice(0, i + 1) + str.charAt(i + 1).toUpperCase() + str.slice(i + 2);
      }
    }
    return str;
  }
}

export class TrainingQuizQuestion extends QuizQuestion {
  public badAnswers: string[];

  constructor(answer: string, image: string, badAnswers: string[]) {
    super([answer], image);
    this.badAnswers = badAnswers;
  }
}