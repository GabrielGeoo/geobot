import { AttachmentBuilder, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import puppeteer from 'puppeteer';
import fs from 'fs';
require('dotenv').config();

const mapsCommand = new SlashCommandBuilder()
  .setName("maps")
  .setDescription("Maps");

const maps = {
  data: mapsCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    if (interaction instanceof ChatInputCommandInteraction) interaction.deferReply();

    const file = fs.readFileSync('assets/data/maps/test.json', 'utf8');
    const data = JSON.parse(file);
    const coords = data.customCoordinates;
    const random = Math.floor(Math.random() * coords.length);
    const coord = coords[random];
    const url = `http://localhost:8080?key=${process.env.GOOGLE_MAPS_API_KEY}&lat=${coord.lat}&lng=${coord.lng}&heading=${coord.heading}&pitch=${coord.pitch}&zoom=${coord.zoom}`;
    console.log(url);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const ratio = 200;
    await page.setViewport({width: 16*ratio, height: 9*ratio});
    await page.goto(url);
    await page.waitForSelector('#map img', { visible: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const element = await page.$('#map');
    const tempFileName = 'map' + new Date().getTime() + '.png';
    await element!.screenshot({ path: tempFileName });
    await browser.close();

    // Envoyer l'image dans le message
    const buffer = fs.readFileSync(tempFileName);
    const attachment = new AttachmentBuilder(buffer).setName(tempFileName);
    if (interaction instanceof ChatInputCommandInteraction) {
      await interaction.editReply({ files: [attachment] });
    } else {
      await interaction.reply({ files: [attachment] });
    }
    // Supprimer l'image
    fs.unlinkSync(tempFileName);
  }
};

export default maps;