import Timer from "easytimer.js";
import Data from "../models/database/Data";
import { AttachmentBuilder, Client, Colors, EmbedBuilder, Snowflake, TextChannel } from "discord.js";
import normalizeString from "../utils/normalize_string";
import getLocalization from "../utils/get_localization";
import { loadImage } from "../utils/load_image";
import fs from 'fs';

export default class CountryStreakHandler {

  public static data: any;
  private static _timer: Timer = new Timer();
  private static _guesses: Map<Snowflake, string> = new Map();
  private static _client: Client;
  private static _waiting: boolean = true;

  public static async init(client: Client) {
    this._client = client;
    this.data = (await Data.findOne())?.cs;
    this._timer.addEventListener('targetAchieved', () => {
      this.onTime();
    });
    if (!this.data) {
      console.log('No data found, creating new data');
      this.data = (await Data.create({ cs: { lat: 0, lng: 0, heading: 0, pitch: 0, zoom: 0, streak: 0 } })).cs;
      const embed = new EmbedBuilder()
        .setTitle('Country Streak')
        .setDescription('Bienvenue sur le country streak! Le but est de deviner le pays affiché sur l\'image. Pour répondre, utilisez la commande `!cs <pays>`.\nPour ajouter du temps si vous êtes plusieurs à jouer, utilisez `!time` ou `!t`')
        .setColor(Colors.Blue);
      const channel = this._client.channels.cache.get(process.env.COUNTRY_STREAK_CHANNEL!) as TextChannel;
      console.log('Sending first message');
      const message = await channel.send({ embeds: [embed] });
      console.log('Pinning message');
      message.pin();
      await this.sendNextStreak();
    }
  }

  public static guess(user: Snowflake, answer: string): boolean {
    if (this._waiting) return false;
    if (this._guesses.entries.length === 0) {
      this._timer.start({ countdown: true, startValues: { seconds: 10 }, target: { seconds: 0 }, precision: 'seconds' });
    }
    this._guesses.set(user, normalizeString(answer));
    return true;
  }

  public static incrementTime(): boolean {
    if (this._waiting) return false;
    this._timer.getTimeValues().seconds += 10;
    return true;
  }

  private static async onTime() {
    this._waiting = false;

    this._timer.stop();

    const valueCounts: { [key: string]: number } = {};
    this._guesses.forEach(value => valueCounts[value] = (valueCounts[value] || 0) + 1);
    const answer = Object.keys(valueCounts).reduce((a, b) =>
      valueCounts[a] > valueCounts[b] ? a : b
    );

    const goodAnswer = await getLocalization(this.data.lat, this.data.lng);
    let embed = new EmbedBuilder();
    const link = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${this.data.lat},${this.data.lng}&heading=${this.data.heading}&pitch=${this.data.pitch}&zoom=${this.data.zoom}`;
    embed.setDescription(`La bonne réponse était [${goodAnswer.country}](${link})\nSubdivision: ${goodAnswer.subdivision1}, ${goodAnswer.subdivision2}`);
    if (answer === normalizeString(goodAnswer.country)) {
      this.data.streak++;
      embed.setTitle('Bonne réponse!');
      embed.setColor(Colors.Green);
      embed.setDescription(embed.data.description + `\n\nLa streak est maintenant de ${this.data.streak}`);
    } else {
      this.data.streak = 0;
      embed.setTitle('Mauvaise réponse!');
      embed.setColor(Colors.Red);
      embed.setDescription(embed.data.description + `\n\nLa streak revient à 0`);
    }

    const channel = this._client.channels.cache.get(process.env.COUNTRY_STREAK_CHANNEL!) as TextChannel;
    await channel.send({ embeds: [embed] });
    this.sendNextStreak();
  }

  private static async sendNextStreak() {
    const file = fs.readFileSync(`assets/data/maps/cs.json`, 'utf8');
    const data = JSON.parse(file);
    const coords = data.customCoordinates;
    const random = Math.floor(Math.random() * coords.length);
    this.data.lat = coords[random].lat;
    this.data.lng = coords[random].lng;
    this.data.heading = coords[random].heading;
    this.data.pitch = coords[random].pitch;
    this.data.zoom = coords[random].zoom;

    const buffer = await loadImage(this.data);
    const attachment = new AttachmentBuilder(buffer).setName('cs.png');
    const channel = this._client.channels.cache.get(process.env.COUNTRY_STREAK_CHANNEL!) as TextChannel;
    await channel.send({ files: [attachment] });
    fs.unlinkSync(`${this.data.lat}_${this.data.lng}_${this.data.heading}_${this.data.pitch}_${this.data.zoom}.png`);
    this._waiting = false;
    await Data.updateOne({}, { cs: this.data });
  }
}