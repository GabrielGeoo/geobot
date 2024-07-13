import { Chart, ChartConfiguration, Plugin } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import 'chartjs-adapter-moment';
import { AttachmentBuilder, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import * as fs from 'fs';
import { getDbUser, getUser } from "../../utils/get_info_from_command_or_message";

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1000, height: 600 });

const plugin: Plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: Chart) => {
    const {ctx} = chart;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

const rankgraphCommand = new SlashCommandBuilder()
  .setName("rankgraph")
  .setDescription("Affiche le graphique de l'évolution de votre classement sur Geoguessr.")
  .addUserOption(option => option
    .setName("user")
    .setDescription("L'utilisateur dont on veut voir le graphique.")
    .setRequired(false)
  );

const rankgraph = {
  data: rankgraphCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    const user = await getDbUser(interaction);
    const rankdata = user.rankData;
    
    if (!user.geoguessrId) {
      await interaction.reply({
        content: user.userId === getUser(interaction).id
          ? "Vous n'êtes pas enregistré. Utilisez la commande `!register <votre_lien_de_profil_geoguessr>`"
          : "Cet utilisateur n'est pas enregistré", ephemeral: true
      });
      return;
    }

    if (rankdata.length <= 1) {
      if (rankdata.length === 0) {
        interaction.reply("Vous n'avez pas de donnée enregistrée");
      } else {
        interaction.reply("Vous n'avez qu'une donnée enregistrée, revenez demain, les données sont enregistrés chaque jour");
      }
      return;
    }

    const dates = rankdata.map((data: any) => data.date as Date) //Array.from({ length: 4 }, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000));
    const labels = dates.map((date: Date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));
    const min = new Date(Math.min(...labels.map((date: Date) => new Date(date).getTime())));
    min.setDate(min.getDate() - 1);
    const max = new Date(Math.max(...labels.map((date: Date) => new Date(date).getTime())));

    const configuration: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Score',
          data: rankdata.map((data: any) => data.rating),
          borderColor: 'rgb(75, 192, 192)',
          radius: 0,
          borderWidth: 5,
        }]
      },
      options: {
        layout: {
          padding: 20
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            },
            min: min.toISOString().split('T')[0] + " 22:00:00",
            max: max.toISOString().split('T')[0] + " 05:00:00",
            title: {
              display: false,
            },
            ticks: {
              source: 'labels',
              font: {
                size: 16
              }
            }
          },
          y: {
            title: {
              display: false,
            },
            ticks: {
              font: {
                size: 16
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      },
      plugins: [plugin],
    };

    const image = await chartJSNodeCanvas.renderToBuffer(configuration);

    fs.writeFileSync('./chart.png', image);
    const attachment = new AttachmentBuilder('./chart.png');
    await interaction.reply({ files: [attachment], ephemeral: true });
    fs.unlinkSync('./chart.png');
  }
};

export default rankgraph;