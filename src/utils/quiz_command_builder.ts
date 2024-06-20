import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import QuizManager from "../handler/quiz_handler";
import getFiles from "./get_files";
import path from "path";
import normalizeString from "./normalize_string";
import getAlias from "./get_alias";

export default function buildQuizCommand(data: any): any {
  const command = new SlashCommandBuilder()
    .setName(data.command)
    .setDescription(data.description)
    .addNumberOption(option => option
      .setName("questions_number")
      .setDescription("Nombre de questions")
      .setMinValue(1)
      .setRequired(false))
    .addStringOption(option => option
      .setName("sous_quiz")
      .setDescription("Sous quiz")
      .setRequired(false));

  return {
    data: command,
    quizCommand: true,
    transformOptionsToArgs(interaction: ChatInputCommandInteraction) {
      return [interaction.options.getNumber("questions_number")?.toString() ?? "1", interaction.options.getString("sous_quiz", false)];
    },
    async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
      let questionsNumber = args[0] ? parseInt(args[0]) : 1;
      let sousQuiz;
      if (isNaN(questionsNumber)) {
        sousQuiz = args.join(" ");
        questionsNumber = 1;
      } else if (questionsNumber < 1) {
        await interaction.reply("Le nombre de questions doit être supérieur à 1.");
        return;
      } else {
        sousQuiz = args.slice(1).join(" ");
      }

      const channelId = interaction.channelId;
      const quizAnswer = QuizManager.getInstance().getQuiz(channelId);
      if (quizAnswer) {
        await interaction.reply("Un quiz est déjà en cours dans ce channel !");
        return;
      }

      const files = getFiles(path.join(__dirname, "../..", "assets/images/" + data.command + (sousQuiz ? `/${normalizeString(sousQuiz)}` : "")), {recursive: false, complete: true});
      if (files.length === 0) {
        await interaction.reply("Ce quiz n'existe pas.");
        return;
      }
      //remove path.join(__dirname, "../..", "assets/images/" + data.command) from the file path
      for (let i = 0; i < files.length; i++) {
        files[i] = files[i].replace(path.join(__dirname, "../..", "assets/images/" + data.command), "");
        //remove the first / from the file path
        while (files[i].startsWith("/") || files[i].startsWith("\\")) {
          files[i] = files[i].substring(1);
        }
      }

      const allAnswers: any[] = files.map(file => {
        const answer = normalizeString(file.split(".")[0].split(";")[0]);
        return {
          answer: answer.split(/[\/\\]/)[answer.split(/[\/\\]/).length - 1],
          image: file
        };
      });


      if (questionsNumber > allAnswers.length) {
        await interaction.reply("Le nombre maximum de questions pour ce type de quiz est de " + allAnswers.length + " questions.");
        return;
      }

      //build quiz
      QuizManager.getInstance().createQuiz(channelId, data.command, data.question, data.color);
      for (let i = 0; i < questionsNumber; i++) {
        const random = Math.floor(Math.random() * allAnswers.length);
        const alias = await getAlias(allAnswers[random].answer);
        const answers = new Set<string>(alias);
        answers.delete(allAnswers[random]);
        QuizManager.getInstance().getQuiz(channelId)?.addQuestion(
          [allAnswers[random].answer, ...answers],
          allAnswers[random].image
        );

        allAnswers.splice(random, 1);
      }

      await QuizManager.getInstance().getQuiz(channelId)?.sendCurrentQuestion(interaction);
    }
  }
}