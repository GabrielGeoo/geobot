import { BaseInteraction, ChatInputCommandInteraction, Message, MessageCreateOptions, Snowflake, TextChannel } from "discord.js";
import normalizeString from "../utils/normalize_string";
import QuizHandler from "../handler/quiz_handler";
import { getDbUser } from "../utils/get_info_from_command_or_message";
import Timer, { TimeCounter } from "easytimer.js";

export abstract class Quiz<T extends QuizQuestion = QuizQuestion> {
  protected _questions: T[];
  protected _currentQuestion: number;
  protected _score: Map<Snowflake, number>;
  protected _timeout?: NodeJS.Timeout;
  protected _afkQuestion: number = 0;
  protected _timer: Timer = new Timer();

  constructor() {
    this._questions = [];
    this._currentQuestion = 0;
    this._score = new Map<Snowflake, number>();
  }

  public get currentQuestion(): T {
    return this._questions[this._currentQuestion];
  }

  public get score(): Map<Snowflake, number>{
    return this._score;
  }

  public get time(): TimeCounter {
    return this._timer.getTimeValues();
  }

  public resetAfkQuestion(): void {
    this._afkQuestion = 0;
  }

  public async nextQuestion(interaction: BaseInteraction | Message): Promise<void> {
    this._timer.stop();
    this._timer.reset();
    this._currentQuestion++;
    this._afkQuestion++;
    if (this.isFinished() || this._afkQuestion > 3) {
      this.finishQuiz(interaction);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.sendCurrentQuestion(interaction);
    }
  }

  public async finishQuiz(interaction: BaseInteraction | Message): Promise<void> {
    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = undefined;
    for (let [userId, score] of this.score) {
      const dbUser = await getDbUser(userId);
      dbUser.quizTotalScore += score;
      dbUser.scores.daily += score;
      dbUser.scores.weekly += score;
      dbUser.scores.monthly += score;
      await dbUser.save();
    }
    
    const message = this.getResultMessage();
    await (interaction.channel as TextChannel)?.send({ content: message, allowedMentions: { parse: [] }});
    QuizHandler.getInstance().removeQuiz(interaction.channel!.id);
  }

  protected getResultMessage(): string {
    let message = "Quiz terminé !";
    if (this.score.size == 0) {
      message += "\nAucun joueur n'a marqué de point."
    } else {
      const scoreSorted = new Map([...this.score.entries()].sort((a, b) => b[1] - a[1]));
      message += " Voici les scores :\n";
      scoreSorted.forEach((value, key) => {
        message += `<@${key}> : ${value} points\n`;
      });
    }
    return message;
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

  public addQuestion(question: T): void {
    this._questions.push(question);
  }

  public isCorrectAnswer(answer: string): boolean {
    return this.currentQuestion.answers
      .map((a: string) => normalizeString(a).replaceAll("-", "_"))
      .includes(normalizeString(answer).replaceAll("-", "_"));
  }

  public get answer(): string {
    return this.currentQuestion.getSendAnswer();
  }

  abstract getMessage(): MessageCreateOptions;

  public async doAfterGoodAnswer(message: Message | BaseInteraction): Promise<void> {
    //default do nothing
  }

  public async sendCurrentQuestion(chat: BaseInteraction | Message): Promise<void> {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    let response;
    try {
      response = await (chat.channel as TextChannel)?.send(this.getMessage());
    } catch (e) {
      console.error(e);
      console.log(this.getMessage());
      throw e;
    }
    this._timer.start();
    this._timeout = setTimeout(async () => {
      (chat.channel as TextChannel)?.send(`Temps écoulé. La réponse était: ${this.answer}`);
      await this.nextQuestion(response as Message);
    }, 30000);
  }
}

export class QuizQuestion {
  public answers: string[];
  public image: any;

  constructor(answers: string[], image: any) {
    this.answers = answers;
    this.image = image;
  }

  public getSendAnswer(): string {
    return this.answers[0].replaceAll("_", " ");
  }
}