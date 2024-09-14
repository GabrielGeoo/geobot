import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import getGeoguessrData from "../utils/geoguessr_data/geoguessr_data";

const goatCommand = new SlashCommandBuilder()
  .setName("goat")
  .setDescription("Le goat de Geoguessr");

const goat = {
  data: goatCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    const blinkyId = "5b51062a4010740f7cd91dd5";
    const data = await getGeoguessrData(blinkyId);
    const image = "https://www.geoguessr.com/images/gravity:ce/plain/" + data.fullBodyPin;
    const thumbnail = "https://www.geoguessr.com/images/gravity:ce/plain/" + data.pin.url;
    
    const embed = new EmbedBuilder()
      .setTitle("Blinky :goat: :flag_fr:")
      .setDescription("Le goat de Geoguessr, tout simplement")
      .setColor("#FFD700")
      .setImage(image)
      .setThumbnail(thumbnail);

    await interaction.reply({ embeds: [embed] });
  }
};

export default goat;