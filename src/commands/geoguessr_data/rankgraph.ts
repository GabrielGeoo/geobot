import { ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import * as fs from 'fs';

const rankgraphCommand = new SlashCommandBuilder()
  .setName("rankgraph")
  .setDescription("Affiche le graphique de l'évolution de votre classement sur Geoguessr.");

const rankgraph = {
  data: rankgraphCommand,
  async execute(interaction: ChatInputCommandInteraction | Message) {
    const width = 800;
    const height = 600;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const configuration: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [new Date(2021, 0, 1), new Date(2021, 0, 2), new Date(2021, 0, 3), new Date(2021, 0, 4), new Date(2021, 0, 5)],
        datasets: [{
          label: 'Score',
          data: [10, 20, 30, 40, 50],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Score'
            }
          }
        }
      }
    };

    const image = await chartJSNodeCanvas.renderToBuffer(configuration);

    fs.writeFileSync('./chart.png', image);
    await interaction.reply({ files: ['./chart.png'] });
    fs.unlinkSync('./chart.png');
  }
};

export default rankgraph;