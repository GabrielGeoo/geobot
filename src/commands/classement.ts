import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { getDbUser, getUser } from "../utils/get_info_from_command_or_message";

const classementCommand = new SlashCommandBuilder()
    .setName("classement")
    .setDescription("Affiches le nombre de bonnes réponses aux quiz d'un joueur ou de soi-même.")
    .addUserOption(option => option
      .setName("user")
      .setDescription("L'utilisateur dont on veut voir le classement.")
      .setRequired(false)
    );

const classement = {
    data: classementCommand,
    async execute(interaction: ChatInputCommandInteraction | Message) {
      const user = await getDbUser(interaction);
      if (user.userId === getUser(interaction).id) {
        await interaction.reply(`Tu as ${user.quizTotalScore ?? 0} points.`);
      } else {
        await interaction.reply(`<@${user.userId}> a ${user.quizTotalScore ?? 0} points.`);
      }
    }
};

export default classement;