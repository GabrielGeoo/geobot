import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { getUser } from "../../utils/get_info_from_command_or_message";
import User from "../../models/User";

const coinsCommand = new SlashCommandBuilder()
    .setName("coins")
    .setDescription("Affiches votre nombre de coins actuel");

const coins = {
    data: coinsCommand,
    async execute(interaction: ChatInputCommandInteraction | Message) {
      const user = getUser(interaction);
      const dbUser = await User.findOne({ userId: user.id });
      const guild = await interaction.client.guilds.fetch("728006388936081528");
      const emoji = await guild.emojis.fetch("1249789221032693782");
      if (!dbUser) {
        await User.create({ userId: user.id });
        await interaction.reply(`Vous avez actuellement 0 coins ${emoji}`);
      } else {
        await interaction.reply(`Vous avez actuellement ${dbUser.coins} coins ${emoji}`);
      }
    }
};

export default coins;