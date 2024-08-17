import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import CountryStreakHandler from "../handler/country_streak_handler";

const timeCommand = new SlashCommandBuilder()
    .setName("time")
    .setDescription("Ajoute du 10s au timer du country streak");

const time = {
    data: timeCommand,
    async execute(interaction: ChatInputCommandInteraction | Message) {
        if (interaction.channel?.id != process.env.COUNTRY_STREAK_CHANNEL) {
            interaction.reply({ content: "Ce n'est pas le bon channel pour jouer au country streak", ephemeral: true });
            return;
          }
        const result = CountryStreakHandler.incrementTime();
        if (result) {
            interaction.reply("Le temps a été ajouté!").then((m) => {
                setTimeout(() => {
                    m.delete();
                }, 5000);
            });
        } else {
            interaction.reply({ content: "Tu ne peux pas ajouter du temps pour le moment", ephemeral: true }).then((m) => {
                setTimeout(() => {
                    m.delete();
                }, 5000);
            });
        }
    }
};

export default time;