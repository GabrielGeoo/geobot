import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { getDbUser, getUser } from "../utils/get_info_from_command_or_message";
import User from "../models/database/User";

const helpUtilisation = "Utilisation :\n`/classement` pour voir ton classement.\n`/classement @user` pour voir le classement de quelqu'un d'autre.\n`/classement <option>` pour voir le classement global(g), journalier(d), hebdomadaire(w) ou mensuel(m).";

const classementCommand = new SlashCommandBuilder()
  .setName("classement")
  .setDescription("Affiches le nombre de bonnes réponses aux quiz d'un joueur ou de soi-même.")
  .addUserOption(option => option
    .setName("user")
    .setDescription("L'utilisateur dont on veut voir le classement.")
    .setRequired(false)
  )
  .addStringOption(option => option
    .setName("option")
    .setDescription("Options du classement à afficher.")
    .setRequired(false)
    .setChoices([
      { name: "Global", value: "global" },
      { name: "Journalier", value: "daily" },
      { name: "Hebdomadaire", value: "weekly" },
      { name: "Mensuel", value: "monthly" }
    ])
  );

const classement = {
  data: classementCommand,
  transformOptionsToArgs(interaction: ChatInputCommandInteraction) {
    return [interaction.options.getString("option", false)]
  },
  helpUtilisation,
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
    switch (args[0]) {
      case "global":
      case "g":
        const users = await User.find({ quizTotalScore: {$gt: 0}}).sort({ quizTotalScore: -1 }).limit(10);
        const usersString = users.map((user, index) => `${index + 1}. <@${user.userId}> - ${user.quizTotalScore ?? 0} points`).join("\n");
        await interaction.reply({ content: `Classement global :\n${usersString}`, allowedMentions: { parse: [] } });
        break;
      case "daily":
      case "d":
      case "j":
        const dailyUsers = await User.find({ "scores.daily": {$gt: 0}}).sort({ "scores.daily": -1 }).limit(10);
        const dailyUsersString = dailyUsers.map((user, index) => `${index + 1}. <@${user.userId}> - ${user.scores!.daily ?? 0} points`).join("\n");
        await interaction.reply({ content: `Classement du jour :\n${dailyUsersString}`, allowedMentions: { parse: [] } });
        break;
      case "weekly":
      case "w":
      case "s":
        const weeklyUsers = await User.find({ "scores.weekly": {$gt: 0}}).sort({ "scores.weekly": -1 }).limit(10);
        const weeklyUsersString = weeklyUsers.map((user, index) => `${index + 1}. <@${user.userId}> - ${user.scores!.weekly ?? 0} points`).join("\n");
        await interaction.reply({ content: `Classement de la semaine :\n${weeklyUsersString}`, allowedMentions: { parse: [] } });
        break;
      case "monthly":
      case "m":
        const monthlyUsers = await User.find({ "scores.monthly": {$gt: 0}}).sort({ "scores.monthly": -1 }).limit(10);
        const monthlyUsersString = monthlyUsers.map((user, index) => `${index + 1}. <@${user.userId}> - ${user.scores!.monthly ?? 0} points`).join("\n");
        await interaction.reply({ content: `Classement du mois :\n${monthlyUsersString}`, allowedMentions: { parse: [] } });
        break;
      default:
        const user = await getDbUser(interaction);
        if (user.userId === getUser(interaction).id) {
          await interaction.reply(`Tu as ${user.quizTotalScore ?? 0} points.`);
        } else {
          await interaction.reply(`<@${user.userId}> a ${user.quizTotalScore ?? 0} points.`);
        }
        break;
    }
  }
};

export default classement;