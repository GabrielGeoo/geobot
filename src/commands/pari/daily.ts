import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { getDbUser } from "../../utils/get_info_from_command_or_message";

const dailyCommand = new SlashCommandBuilder()
  .setName("daily")
  .setDescription("Réclame ta récompense quotidienne");

const daily = {
  data: dailyCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    const user = await getDbUser(interaction);
    const lastDaily = user.lastDaily;
    const now = new Date();
    const eqYear = lastDaily.getFullYear() === now.getFullYear();
    const eqMonth = lastDaily.getMonth() === now.getMonth();
    const eqDay = lastDaily.getDate() === now.getDate();
    if (!eqYear || !eqMonth || !eqDay) {
      user.coins += 100;
      user.lastDaily = now;
      await user.save();
      await interaction.reply("Récompense quotidienne réclamée avec succès! Vous avez reçu 100 coins");
    } else {
      await interaction.reply(`Vous avez déjà réclamé votre récompense quotidienne aujourd'hui. Réessayez demain!`);
    }
  }
};

export default daily;