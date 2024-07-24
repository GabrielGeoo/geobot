import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";

const timeCommand = new SlashCommandBuilder()
    .setName("time")
    .setDescription("Ajoute du 10s au timer du country streak");

const time = {
    data: timeCommand,
    async execute(interaction: ChatInputCommandInteraction | Message) {
        
    }
};

export default time;