import { ChatInputCommandInteraction, Message, User as DiscordUser, Snowflake } from "discord.js";
import User from "../models/database/User";

export function getUser(chat: ChatInputCommandInteraction | Message): DiscordUser {
  return chat instanceof Message ? chat.author : chat.user;
}

export async function getDbUser(interaction: ChatInputCommandInteraction | Message | Snowflake): Promise<any> {
  let userId: Snowflake;
  if (interaction instanceof ChatInputCommandInteraction) {
    userId = interaction.options.getUser("user")?.id ?? interaction.user.id;
  } else if (interaction instanceof Message) {
    userId = interaction.mentions.users.first()?.id ?? interaction.author.id;
  } else {
    userId = interaction;
  }

  const dbUser = await User.findOne({ userId: userId });
  if (!dbUser) {
    return await User.create({ userId: userId });
  }

  return dbUser;
}
