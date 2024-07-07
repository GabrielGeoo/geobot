import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import puppeteer from 'puppeteer';
import fs from 'fs';
import FileHandler from "../handler/file_handler";
import QuizHandler from "../handler/quiz_handler";
import GeoQuiz from "../models/GeoQuiz";
import getLocalization from "../utils/get_localization";
require('dotenv').config();

const mapsCommand = new SlashCommandBuilder()
  .setName("quiz")
  .setDescription("Quiz sur une map à renseigner")
  .addStringOption(option => option.setName("map").setDescription("Map sur laquelle faire le quiz").setRequired(true))
  .addNumberOption(option => option.setName("question_number").setDescription("Nombre de questions").setRequired(false).setMinValue(1));

const maps = {
  data: mapsCommand,
  transformOptionsToArgs(interaction: ChatInputCommandInteraction) {
    return [interaction.options.getString("map"), interaction.options.getNumber("questions_number")?.toString() ?? "1"];
  },
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
    const quizAnswer = QuizHandler.getInstance().getQuiz(interaction.channelId);
    if (quizAnswer) {
      await interaction.reply("Un quiz est déjà en cours dans ce channel !");
      return;
    }
    const map = args[0];
    if (!map) {
      await interaction.reply("Précisez une map.");
      return;
    }
    const questionsNumber = parseInt(args[1]) ?? "1";
    if (questionsNumber < 1) {
      await interaction.reply("Ln nombre de questions doit être supérieur à 1.");
      return;
    }
    if (interaction instanceof ChatInputCommandInteraction) interaction.deferReply();

    const now = new Date();
    let file;
    try {
      file = fs.readFileSync(`assets/data/maps/${map}.json`, 'utf8');
    } catch (e) {
      await interaction.reply("Cette map n'existe pas.");
      return;
    }
    const data = JSON.parse(file);
    const coords = data.customCoordinates;
    const random = Math.floor(Math.random() * coords.length);
    const coord = coords[random];
    const fileName = `${coord.lat}_${coord.lng}_${coord.heading}_${coord.pitch}_${coord.zoom}.png`;
    let dateDebug = new Date();
    const dbImage = await FileHandler.getImage(fileName);
    console.log(`Image retrieved in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s`);
    dateDebug = new Date();
    let buffer: Buffer;
    if (dbImage) {
      buffer = dbImage;
    } else {
      const url = `http://localhost:8080/map?key=${process.env.GOOGLE_MAPS_API_KEY}&lat=${coord.lat}&lng=${coord.lng}&heading=${coord.heading}&pitch=${coord.pitch}&zoom=${coord.zoom}`;
      console.log(url);

      const browser = await puppeteer.launch();
      console.log(`Browser launched in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
      dateDebug = new Date();
      const page = await browser.newPage();
      console.log(`Page created in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
      dateDebug = new Date();
      const ratio = 200;
      await page.setViewport({ width: 16 * ratio, height: 9 * ratio });
      console.log(`Viewport set in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
      dateDebug = new Date();
      await page.goto(url, { waitUntil: 'networkidle0' });
      console.log(`Page loaded in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
      dateDebug = new Date();
      const element = await page.$('#map');
      await element!.screenshot({ path: fileName });
      console.log(`Screenshot taken in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
      dateDebug = new Date();
      await browser.close();
      console.log(`Browser closed in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
      dateDebug = new Date();
      // Envoyer l'image dans le message
      buffer = fs.readFileSync(fileName);
    }

    QuizHandler.getInstance().createQuiz(interaction.channelId, new GeoQuiz());
    const localization = await getLocalization(coord.lat, coord.lng);
    QuizHandler.getInstance().getQuiz(interaction.channelId)?.addQuestion([localization.country], buffer, `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coord.lat},${coord.lng}&heading=${coord.heading}&pitch=${coord.pitch}&zoom=${coord.zoom}`);
    await QuizHandler.getInstance().getQuiz(interaction.channelId)?.sendCurrentQuestion(interaction);
    console.log(`Quiz created in ${(new Date().getTime() - dateDebug.getTime()) / 1000}s (total time : ${(new Date().getTime() - now.getTime()) / 1000}s)`);
    console.log(`Maps command executed with ${dbImage == null} in ${(new Date().getTime() - now.getTime()) / 1000}s`);

    if (!dbImage) {
      await FileHandler.writeImage(buffer, fileName);
      fs.unlinkSync(fileName);
    }
  }
};

export default maps;