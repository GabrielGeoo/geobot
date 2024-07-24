import { AttachmentBuilder, Message, MessageCreateOptions } from "discord.js";
import { Quiz, QuizQuestion } from "./Quiz";

export class GeoQuiz extends Quiz<GeoQuizQuestion> {
  getMessage(): MessageCreateOptions {
    const attachment = new AttachmentBuilder(this.currentQuestion.image).setName("geoquiz.png");
    return { files: [attachment] };
  }

  public async sendMessageAfterGoodAnswer(message: Message): Promise<void> {
    await message.channel?.send(`Bien joué ${message.author.displayName} ! La localisation exact est: ${this.answer}`);
  }
}

export class GeoQuizQuestion extends QuizQuestion {
  private _link: string;

  constructor(answers: string[], image: any, link: string) {
    super(answers, image);
    this._link = link;
  }

  public getSendAnswer(): string {
    return `[${this.answers[0].replaceAll("_", " ")}](<${this._link}>)`;
  }
}