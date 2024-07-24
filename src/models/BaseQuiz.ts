import { AttachmentBuilder, ColorResolvable, EmbedBuilder, MessageCreateOptions } from "discord.js";
import { Quiz, QuizQuestion } from "./Quiz";
import normalizeString from "../utils/normalize_string";

export default class BaseQuiz<T extends QuizQuestion> extends Quiz<T> {

  private name: string;
  private question: string;
  private color: ColorResolvable;

  constructor(name: string, question: string, color?: ColorResolvable) {
    super();
    this.name = name;
    this.question = question;
    this.color = color || "#0099ff";
  }

  getMessage(): MessageCreateOptions {
    const imgName = normalizeString(this.currentQuestion.image.split(/[\/\\]/)[this.currentQuestion.image.split(/[\/\\]/).length - 1]);
    const img = new AttachmentBuilder("assets/images/" + this.name + "/" + this.currentQuestion.image).setName(imgName);
    const embed = new EmbedBuilder()
      .setTitle(`${this.question} (${this._currentQuestion + 1}/${this._questions.length})`)
      .setImage("attachment://" + normalizeString(this.currentQuestion.image.split(/[\/\\]/)[this.currentQuestion.image.split(/[\/\\]/).length - 1]))
      .setColor(this.color);
    return { embeds: [embed], files: [img] };
  }
}