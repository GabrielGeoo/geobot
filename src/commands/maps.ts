import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import puppeteer from 'puppeteer';
import fs from 'fs';
import FileHandler from "../handler/file_handler";
import QuizHandler from "../handler/quiz_handler";
import GeoQuiz from "../models/GeoQuiz";
import getLocalization from "../utils/get_localization";
require('dotenv').config();

const mapsCommand = new SlashCommandBuilder()
  .setName("maps")
  .setDescription("Maps");

const maps = {
  data: mapsCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    const quizAnswer = QuizHandler.getInstance().getQuiz(interaction.channelId);
    if (quizAnswer) {
      await interaction.reply("Un quiz est déjà en cours dans ce channel !");
      return;
    }
    if (interaction instanceof ChatInputCommandInteraction) interaction.deferReply();

    const now = new Date();
    const file = fs.readFileSync('assets/data/maps/test.json', 'utf8');
    const data = JSON.parse(file);
    const coords = data.customCoordinates;
    const random = Math.floor(Math.random() * coords.length);
    const coord = coords[random];
    const fileName = `${coord.lat}_${coord.lng}_${coord.heading}_${coord.pitch}_${coord.zoom}.png`;
    const dbImage = await FileHandler.getImage(fileName);
    let buffer: Buffer;
    if (dbImage) {
      buffer = dbImage;
    } else {
      const url = `http://localhost:8080/map?key=${process.env.GOOGLE_MAPS_API_KEY}&lat=${coord.lat}&lng=${coord.lng}&heading=${coord.heading}&pitch=${coord.pitch}&zoom=${coord.zoom}`;
      console.log(url);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const ratio = 200;
      await page.setViewport({ width: 16 * ratio, height: 9 * ratio });
      await page.goto(url);
      await page.waitForSelector('#map img', { visible: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
      const element = await page.$('#map');
      await element!.screenshot({ path: fileName });
      await browser.close();

      // Envoyer l'image dans le message
      buffer = fs.readFileSync(fileName);
    }

    QuizHandler.getInstance().createQuiz(interaction.channelId, new GeoQuiz());
    const localization = await getLocalization(coord.lat, coord.lng);
    QuizHandler.getInstance().getQuiz(interaction.channelId)?.addQuestion([localization.country], buffer);
    await QuizHandler.getInstance().getQuiz(interaction.channelId)?.sendCurrentQuestion(interaction);

    console.log(`Maps command executed with ${dbImage == null} in ${(new Date().getTime() - now.getTime()) / 1000}s`);

    if (!dbImage) {
      await FileHandler.writeImage(buffer, fileName);
      fs.unlinkSync(fileName);
    }
  }
};

export default maps;