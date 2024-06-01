import { AttachmentBuilder, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import puppeteer from 'puppeteer';
import fs from 'fs';

const mapsCommand = new SlashCommandBuilder()
  .setName("maps")
  .setDescription("Maps");

const maps = {
  data: mapsCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    // const response = await fetch('http://localhost:8080');
    // console.log(response);
    // const text = await response.text();
    // console.log(text);
    // interaction.reply('Maps command executed');

    if (interaction instanceof ChatInputCommandInteraction) interaction.deferReply();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const ratio = 200;
    await page.setViewport({width: 16*ratio, height: 9*ratio});
    await page.goto('http://localhost:8080');
    await page.waitForSelector('#map img', { visible: true });
    await setTimeout(() => {}, 1000);
    const element = await page.$('#map');
    await element!.screenshot({ path: 'map.png' });
    await browser.close();

    // Envoyer l'image dans le message
    const buffer = fs.readFileSync('map.png');
    const attachment = new AttachmentBuilder(buffer).setName('map.png');
    if (interaction instanceof ChatInputCommandInteraction) {
      await interaction.editReply({ files: [attachment] });
    } else {
      await interaction.reply({ files: [attachment] });
    }
  }
};

export default maps;