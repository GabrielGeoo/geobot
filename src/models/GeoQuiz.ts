import { AttachmentBuilder, Message, MessageCreateOptions } from "discord.js";
import Quiz from "./Quiz";

export default class GeoQuiz extends Quiz {
  getMessage(): MessageCreateOptions {
    const attachment = new AttachmentBuilder(this.currentQuestion.image).setName("geoquiz.png");
    return { files: [attachment]};
  }

  public async sendMessageAfterGoodAnswer(message: Message): Promise<void> {
    await message.channel?.send(`Bien joué ${message.author.displayName} ! La localisation exact est: ${this.answer}`);
  }
}