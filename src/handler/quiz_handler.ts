import { ColorResolvable, Snowflake } from "discord.js";
import Quiz from "../models/QuizQuestion";

export default class QuizHandler {

  private _data: Map<Snowflake, Quiz> = new Map<Snowflake, Quiz>();
  private static instance: QuizHandler | null = null;

  private constructor(){}

  public static getInstance(): QuizHandler {
    if(!this.instance){
        this.instance = new QuizHandler();
    }
    return this.instance;
  }

  public createQuiz(channelId: Snowflake, name: string, question: string, color?: ColorResolvable): void {
    if (this._data.has(channelId)) {
      throw new Error("Quiz already exist");
    } else { 
      this._data.set(channelId, new Quiz(name, question, color));
    }
  }

  public getQuiz(channelId: Snowflake): Quiz | undefined {
    return this._data.get(channelId);
  }

  public removeQuiz(channelId: Snowflake): void {
    const paireFind: Snowflake | undefined = Array.from(this._data.keys()).find((key: Snowflake) => key === channelId);
    if (paireFind) {
      this._data.delete(paireFind);
    }
  }
}