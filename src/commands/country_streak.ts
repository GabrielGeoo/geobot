import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import CountryStreakHandler from "../handler/country_streak_handler";
import { getUser } from "../utils/get_info_from_command_or_message";

const countryStreakCommand = new SlashCommandBuilder()
  .setName("cs")
  .setDescription("Guess un pays pour le country streak")
  .addStringOption(option => option.setName("pays").setDescription("Le pays que tu penses être affiché").setRequired(true));

const countryStreak = {
  data: countryStreakCommand,
  transformOptionsToArgs: (interaction: ChatInputCommandInteraction) => [interaction.options.getString("pays")],
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
    if (interaction.channel?.id != process.env.COUNTRY_STREAK_CHANNEL) {
      interaction.reply({ content: "Ce n'est pas le bon channel pour jouer au country streak", ephemeral: true });
      return;
    }

    const result = CountryStreakHandler.guess(getUser(interaction).id, args.join(" "));

    if (interaction instanceof ChatInputCommandInteraction) {
      if (result) {
        interaction.reply("Ta réponse a été enregistrée!");
      } else {
        interaction.reply({ content: "Tu ne peux pas répondre pour le moment", ephemeral: true });
      }
    }
  }
};

export default countryStreak;