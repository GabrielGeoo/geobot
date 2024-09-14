import { ChannelType, ChatInputCommandInteraction, Message, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import PrivateChannel from "../models/database/PrivateChannel";

const privateCommand = new SlashCommandBuilder()
  .setName("private")
  .setDescription("Créez un quiz privé pour vous et vos amis.");

const privateCmd = {
  data: privateCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    // const existingChannel = await PrivateChannel.findOne({ userId: interaction.member!.user.id });
    // if (existingChannel) {
    //   return interaction.reply("Vous avez déjà un canal privé.");
    // }
    
    // const category = await interaction.guild?.channels.cache.get(process.env.CATEGORY_CHANNEL_ID!);

    // const channel = await interaction.guild?.channels.create({
    //   name: `private-${interaction.member!.user.username}`,
    //   type: ChannelType.GuildText,
    //   parent: category!.id,
    //   permissionOverwrites: [
    //     {
    //       id: interaction.guild!.id,
    //       deny: [PermissionFlagsBits.ViewChannel],
    //     },
    //     {
    //       id: interaction.member!.user.id,
    //       allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
    //     },
    //   ],
    // });

    // if (interaction instanceof Message) {
    //   await interaction.delete();
    // }
    // if (interaction instanceof ChatInputCommandInteraction) {
    //   await interaction.reply({ content: `Canal privé créé: <#${channel!.id}>`, ephemeral: true });
    // }
  }
};

export default privateCmd;