import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { getDbUser, getUser } from "../utils/get_info_from_command_or_message";
import User from "../models/User";

const classementCommand = new SlashCommandBuilder()
  .setName("classement")
  .setDescription("Affiches le nombre de bonnes réponses aux quiz d'un joueur ou de soi-même.")
  .addUserOption(option => option
    .setName("user")
    .setDescription("L'utilisateur dont on veut voir le classement.")
    .setRequired(false)
  )
  .addBooleanOption(option => option
    .setName("global")
    .setDescription("Afficher le classement global.")
    .setRequired(false)
  );

const classement = {
  data: classementCommand,
  transformOptionsToArgs(interaction: ChatInputCommandInteraction) {
    return [interaction.options.getBoolean("global", false)]
  },
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
    if (args[0] === "true" || args[0] === "global" || args[0] === "g") {
      const users = await User.find().sort({quizTotalScore: -1}).limit(10);
      const usersString = users.map((user, index) => `${index + 1}. <@${user.userId}> - ${user.quizTotalScore ?? 0} points`).join("\n");
      await interaction.reply({ content: `Classement global :\n${usersString}`, allowedMentions: { parse: [] }});
    } else {
      const user = await getDbUser(interaction);
      if (user.userId === getUser(interaction).id) {
        await interaction.reply(`Tu as ${user.quizTotalScore ?? 0} points.`);
      } else {
        await interaction.reply(`<@${user.userId}> a ${user.quizTotalScore ?? 0} points.`);
      }
    }
  }
};

export default classement;