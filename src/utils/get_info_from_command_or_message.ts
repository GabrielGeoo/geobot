import { ChatInputCommandInteraction, Message, User } from "discord.js";

export function getUser(chat: ChatInputCommandInteraction | Message): User {
  return chat instanceof Message ? chat.author : chat.user;
}