import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import QuizManager from "../handler/quiz_handler";
import getFiles from "../utils/get_files";
import path from "path";
import normalizeString from "../utils/normalize_string";
import { TrainingQuiz, TrainingQuizQuestion } from "../models/TrainingQuiz";
import * as fs from "fs/promises";

const trainingCommand = new SlashCommandBuilder()
  .setName("training")
  .setDescription("Créer un quiz d'entraînement")
  .addStringOption(option =>
    option.setName("quiz").setDescription("Quiz d'entrainement").setRequired(true))
  .addNumberOption(option =>
    option.setMinValue(2).setMaxValue(4).setName("nb_answers").setDescription("Nombre de réponses proposés"))
  .addNumberOption(option =>
    option.setMinValue(1).setName("nb_questions").setDescription("Nombre de questions"))

const training = {
  data: trainingCommand,
  transformOptionsToArgs(interaction: ChatInputCommandInteraction) {
    return [interaction.options.getString("quiz"), interaction.options.getNumber("nb_answers") ?? 4, interaction.options.getNumber("nb_questions") ?? 1];
  },
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
    let quizName = args[0];
    if (!quizName) {
      await interaction.reply("Veuillez spécifier un quiz.");
      return;
    }
    let questionsNumber = args[1] ? parseInt(args[1]) : 1;
    let nbAnswers = args[2] ? parseInt(args[2]) : 4;
    if (nbAnswers > 5) {
      await interaction.reply("Le nombre maximum de réponses est de 5.");
      return;
    }

    const channelId = interaction.channelId;
    const quizAnswer = QuizManager.getInstance().getQuiz(channelId);
    if (quizAnswer) {
      await interaction.reply("Un quiz est déjà en cours dans ce channel !");
      return;
    }

    const files = getFiles(path.join(__dirname, "../..", "assets/images/" + quizName), {recursive: false, complete: true});
    if (files.length === 0) {
      await interaction.reply("Ce quiz n'existe pas.");
      return;
    }
    for (let i = 0; i < files.length; i++) {
      files[i] = files[i].replace(path.join(__dirname, "../..", "assets/images/" + quizName), "");
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

    const allAnswersCopy = [...allAnswers];
    const data = JSON.parse(await fs.readFile(`./assets/data/commands/${quizName}.json`, 'utf8'));
    const quiz = QuizManager.getInstance().createQuiz(channelId, new TrainingQuiz(data.command, data.question, data.color));
    for (let i = 0; i < questionsNumber; i++) {
      const random = Math.floor(Math.random() * allAnswers.length);
      let badAnswers: string[] = [];
      let allAnswersRemaining = [...allAnswersCopy].filter(answer => answer.answer !== allAnswers[random].answer);
      for (let i = 0; i < nbAnswers - 1; i++) {
        const random = Math.floor(Math.random() * allAnswersRemaining.length);
        badAnswers.push(allAnswersRemaining[random].answer);
        allAnswersRemaining.splice(random, 1);
      }
      quiz.addQuestion(new TrainingQuizQuestion(
        allAnswers[random].answer,
        allAnswers[random].image,
        badAnswers
      ));

      allAnswers.splice(random, 1);
    }

    await quiz.sendCurrentQuestion(interaction);
  }
};

export default training;