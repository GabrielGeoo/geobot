import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import QuizManager from "../handler/quiz_handler";
import getFiles from "./get_files";
import path from "path";
import normalizeString from "./normalize_string";
import assert from "assert";
import getAlias from "./get_alias";

export default function buildQuizCommand(data: any): any {
  const command = new SlashCommandBuilder()
    .setName(data.command)
    .setDescription(data.description)
    .addNumberOption(option => option
      .setName("questions_number")
      .setDescription("Nombre de questions")
      .setMinValue(1)
      .setRequired(false));

  return {
    data: command,
    quizCommand: true,
    transformOptionsToArgs(interaction: ChatInputCommandInteraction) {
      return [interaction.options.getNumber("questions_number")?.toString() ?? "1"];
    },
    async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
      const questionsNumber = args[0] ? parseInt(args[0]) : 1;
      if (isNaN(questionsNumber) || questionsNumber < 1) {
        await interaction.reply("Le nombre de questions doit être supérieur à 1.");
        return;
      }

      const channelId = interaction.channelId;
      const quizAnswer = QuizManager.getInstance().getQuiz(channelId);
      if (quizAnswer) {
        await interaction.reply("Un quiz est déjà en cours dans ce channel !");
        return;
      }

      const files = getFiles(path.join(__dirname, "../..", "assets/images/" + data.command), null, false);

      const allAnswers: string[] = data.quiz?.map((q: any) => q.answer) ?? [];
      const allImages: string[] = data.quiz?.map((q: any) => q.image ?? q.answer) ?? [];
      if (allAnswers.find((a: string) => a === undefined || a === null)) {
        console.error("Missing answer in quiz");
        return;
      }
      //validate images
      for (const image of allImages) {
        const find = files.find((file: string) => file.split(".")[0] === normalizeString(image.split(".")[0]));
        if (!find) {
          console.error("Missing image in quiz");
          return;
        } else if (!image.includes(".")) {
          allImages[allImages.indexOf(image)] = find;
        }
      }

      //add auto completion
      if (data.auto) {
        for (const file of files) {
          if (!allImages.includes(file)) {
            const find = allAnswers.find((a) => a === normalizeString(file.split(".")[0]))
            if (find) {
              console.error("Duplication d'une réponse et d'une image dans le quiz pour la réponse : " + find);
              return;
            } else {
              allAnswers.push(file.split(".")[0]);
              allImages.push(file);
            }
          }
        }
      }

      if (questionsNumber > allAnswers.length) {
        await interaction.reply("Le nombre maximum de questions pour ce type de quiz est de " + allAnswers.length + " questions.");
        return;
      }
      assert(allAnswers.length === allImages.length, "Answers and images are not the same length");

      //build quiz
      QuizManager.getInstance().createQuiz(channelId, data.command, data.question, data.color);
      for (let i = 0; i < questionsNumber; i++) {
        const random = Math.floor(Math.random() * allAnswers.length);
        const alias = await getAlias(allAnswers[random]);
        const answers = new Set<string>(alias);
        answers.delete(allAnswers[random]);
        QuizManager.getInstance().getQuiz(channelId)?.addQuestion(
          [allAnswers[random], ...answers],
          allImages[random]
        );

        allAnswers.splice(random, 1);
        allImages.splice(random, 1);
      }

      await QuizManager.getInstance().getQuiz(channelId)?.sendCurrentQuestion(interaction);
    }
  }
}