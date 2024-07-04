import { AttachmentBuilder, MessageCreateOptions } from "discord.js";
import Quiz from "./Quiz";

export default class GeoQuiz extends Quiz {
  getMessage(): MessageCreateOptions {
    const attachment = new AttachmentBuilder(this.currentQuestion.image).setName("geoquiz.png");
    return { files: [attachment] };
  }
}