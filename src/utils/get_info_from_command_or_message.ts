import { ChatInputCommandInteraction, Message, User as DiscordUser } from "discord.js";
import User from "../models/User";

export function getUser(chat: ChatInputCommandInteraction | Message): DiscordUser {
  return chat instanceof Message ? chat.author : chat.user;
}

export async function getDbUser(interaction: ChatInputCommandInteraction | Message): Promise<any> {
  let user;
  if (interaction instanceof ChatInputCommandInteraction) {
    user = interaction.options.getUser("user") ?? interaction.user;
  } else {
    user = interaction.mentions.users.first() ?? interaction.author;
  }

  const dbUser = await User.findOne({ userId: user.id });
  if (!dbUser) {
    return await User.create({ userId: user.id });
  }

  return dbUser;
}
