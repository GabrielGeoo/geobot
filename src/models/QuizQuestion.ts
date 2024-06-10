import { AttachmentBuilder, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, Message, Snowflake } from "discord.js";
import normalizeString from "../utils/normalize_string";
import QuizHandler from "../handler/quiz_handler";
import { getDbUser } from "../utils/get_info_from_command_or_message";

export default class Quiz {
  private _questions: QuizQuestion[];
  private _currentQuestion: number;
  private _score: Map<Snowflake, number>;
  private _data: QuizData;
  private _timeout?: NodeJS.Timeout;

  constructor(name: string, question: string, color?: ColorResolvable) {
    this._data = new QuizData(name, question, color);
    this._questions = [];
    this._currentQuestion = 0;
    this._score = new Map<Snowflake, number>();
  }

  public get currentQuestion(): QuizQuestion {
    return this._questions[this._currentQuestion];
  }

  public get score(): Map<Snowflake, number>{
    return this._score;
  }

  public nextQuestion(interaction: ChatInputCommandInteraction | Message): void {
    this._currentQuestion++;
    if (this.isFinished()) {
      this.finishQuiz(interaction)
    } else {
      this.sendCurrentQuestion(interaction);
    }
  }

  public async finishQuiz(interaction: ChatInputCommandInteraction | Message): Promise<void> {
    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = undefined;
    for (let [userId, score] of this._score) {
      const dbUser = await getDbUser(userId);
      dbUser.quizTotalScore += score;
      await dbUser.save();
    }
    let toSend = "Quiz terminé !";
    if (this.score.size == 0) {
      toSend += "\nAucun joueur n'a marqué de point."
      await interaction.channel?.send(toSend);
    } else {
      toSend += " Voici les scores :\n";
      this.score.forEach((value, key) => {
        toSend += `<@${key}> : ${value} points\n`;
      });
      await interaction.channel?.send(toSend);
    }
    QuizHandler.getInstance().removeQuiz(interaction.channel!.id);
  }

  public get length(): number {
    return this._questions.length;
  }

  public addPoint(userId: Snowflake): void {
    this._score.set(userId, (this._score.get(userId) ?? 0) + 1);
  }

  public isFinished(): boolean {
    return this._currentQuestion === this._questions.length;
  }

  public addQuestion(answer: string[], image: string): void {
    this._questions.push(new QuizQuestion(answer, image));
  }

  public isCorrectAnswer(answer: string): boolean {
    return this.currentQuestion.answers
      .map((a: string) => normalizeString(a).replaceAll("-", "_"))
      .includes(normalizeString(answer).replaceAll("-", "_"));
  }

  public get answer(): string {
    return this.currentQuestion.answers[0].replaceAll("_", " ");
  }

  public async sendCurrentQuestion(chat: ChatInputCommandInteraction | Message): Promise<void> {
    const img = new AttachmentBuilder("assets/images/" + this._data.name + "/" + this.currentQuestion.image).setName(normalizeString(this.currentQuestion.image));
    const embed = new EmbedBuilder()
      .setTitle(this._data.question)
      .setImage("attachment://" + normalizeString(this.currentQuestion.image))
      .setColor(this._data.color);
    
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    const response = await chat.channel?.send({ embeds: [embed], files: [img] });
    this._timeout = setTimeout(() => {
      chat.channel?.send(`Temps écoulé. La réponse était: ${this.answer}`);
      this.nextQuestion(response as Message);
    }, 30000);
  }
}

class QuizQuestion {
  public answers: string[];
  public image: string;

  constructor(answers: string[], image: string) {
    this.answers = answers;
    this.image = image;
  }
}

class QuizData {
  public name: string;
  public question: string;
  public color: ColorResolvable;

  constructor(name: string, question: string, color?: ColorResolvable) {
    this.name = name;
    this.question = question;
    this.color = color ?? "#0055ff";
  }
}