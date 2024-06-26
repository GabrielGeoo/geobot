import { AttachmentBuilder, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, Message, Snowflake } from "discord.js";
import normalizeString from "../utils/normalize_string";
import QuizHandler from "../handler/quiz_handler";
import { getDbUser } from "../utils/get_info_from_command_or_message";
import Timer, { TimeCounter } from "easytimer.js";

export default class Quiz {
  private _questions: QuizQuestion[];
  private _currentQuestion: number;
  private _score: Map<Snowflake, number>;
  private _data: QuizData;
  private _timeout?: NodeJS.Timeout;
  private _waitingQuestion: boolean = false;
  private _afkQuestion: number = 0;
  private _timer: Timer = new Timer();

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

  public get waitingQuestion(): boolean {
    return this._waitingQuestion;
  }

  public get time(): TimeCounter {
    return this._timer.getTimeValues();
  }

  public resetAfkQuestion(): void {
    this._afkQuestion = 0;
  }

  public async nextQuestion(interaction: ChatInputCommandInteraction | Message): Promise<void> {
    this._timer.stop();
    this._timer.reset();
    this._currentQuestion++;
    this._afkQuestion++;
    if (this.isFinished() || this._afkQuestion > 3) {
      this.finishQuiz(interaction)
    } else {
      this._waitingQuestion = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      this._waitingQuestion = false;
      this.sendCurrentQuestion(interaction);
    }
  }

  public async finishQuiz(interaction: ChatInputCommandInteraction | Message): Promise<void> {
    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = undefined;
    for (let [userId, score] of this.score) {
      const dbUser = await getDbUser(userId);
      dbUser.quizTotalScore += score;
      await dbUser.save();
    }
    let toSend = "Quiz terminé !";
    if (this.score.size == 0) {
      toSend += "\nAucun joueur n'a marqué de point."
      await interaction.channel?.send(toSend);
    } else {
      const scoreSorted = new Map([...this.score.entries()].sort((a, b) => b[1] - a[1]));
      toSend += " Voici les scores :\n";
      scoreSorted.forEach((value, key) => {
        toSend += `<@${key}> : ${value} points\n`;
      });
      await interaction.channel?.send({ content: toSend, allowedMentions: { parse: [] }});
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
    const imgName = normalizeString(this.currentQuestion.image.split(/[\/\\]/)[this.currentQuestion.image.split(/[\/\\]/).length - 1]);
    const img = new AttachmentBuilder("assets/images/" + this._data.name + "/" + this.currentQuestion.image).setName(imgName);
    const embed = new EmbedBuilder()
      .setTitle(`${this._data.question} (${this._currentQuestion + 1}/${this._questions.length})`)
      .setImage("attachment://" + normalizeString(this.currentQuestion.image.split(/[\/\\]/)[this.currentQuestion.image.split(/[\/\\]/).length - 1]))
      .setColor(this._data.color);
    
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    const response = await chat.channel?.send({ embeds: [embed], files: [img] });
    this._timer.start();
    this._timeout = setTimeout(async () => {
      chat.channel?.send(`Temps écoulé. La réponse était: ${this.answer}`);
      await this.nextQuestion(response as Message);
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