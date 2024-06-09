import { ChatInputCommandInteraction, Message, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import Pari from "../../models/Pari";

const setPariCommand = new SlashCommandBuilder()
  .setName("pari")
  .setDescription("Créez et supprimez un pari")
  .addSubcommand(subcommand => subcommand
    .setName("create")
    .setDescription("Créez un pari")
    .addStringOption(option => option.setName("date").setDescription("La date limite du pari").setRequired(true))
    .addStringOption(option => option.setName("pari").setDescription("Le pari").setRequired(true))
  )
  .addSubcommand(subcommand => subcommand
    .setName("delete")
    .setDescription("Supprime un pari")
    .addStringOption(option => option.setName("pari").setDescription("Le pari").setRequired(true))
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const setPari = {
  data: setPariCommand,
  permissions: [PermissionFlagsBits.Administrator],
  transformOptionsToArgs: (interaction: ChatInputCommandInteraction) => {
    const pari = interaction.options.getString("pari", true);
    const date = interaction.options.getString("date", false);
    return date ? [date, pari] : [pari];
  },
  async execute(interaction: ChatInputCommandInteraction | Message, args: string[]) {
    const subCommand = args[0];

    switch (subCommand) {
      case "create": {
        const dateString = args[1];
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})\+([01][0-9]|2[0-3]):([0-5][0-9])$/;
        let date = null;

        if (dateRegex.test(dateString)) {
          const match = dateString.match(dateRegex);
          if (match) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10) - 1;
            const year = parseInt(match[3], 10);
            const hour = parseInt(match[4], 10);
            const minute = parseInt(match[5], 10);

            date = new Date(year, month, day, hour, minute);
          }
        }
        if (!date) {
          await interaction.reply("La date doit être au format jj-mm-aaaa+hh:mm");
          return;
        }

        const pari = args.slice(2).join(" ");
        const existingPari = await Pari.findOne({ pariName: pari });
        if (existingPari) {
          await interaction.reply(`Le pari "${pari}" existe déjà`);
          return;
        }
        await Pari.create({ pariName: pari, date });
        await interaction.reply(`Le pari "${pari}" a été créé pour le ${date.toLocaleString()}`);

        break;
      }
      case "delete": {
        const pari = args.slice(1).join(" ");
        const existingPari = await Pari.findOne({ pariName: pari });
        if (!existingPari) {
          await interaction.reply(`Le pari "${pari}" n'existe pas`);
          return;
        }
        await existingPari.deleteOne();
        await interaction.reply(`Le pari "${pari}" a été supprimé`);
        break;
      }
      default: {
        await interaction.reply({ content: "Commande inconnue", ephemeral: true });
        return;
      }
    }
  }
};

export default setPari;