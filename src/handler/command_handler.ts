import { Client, Events, REST, Routes } from "discord.js";
import getFiles from "../utils/get_files";
import path from "path";
import buildQuizCommand from "../utils/quiz_command_builder";
import * as fs from "fs/promises";
require('dotenv').config();

const commands: any[] = [];

export default async function registerCommands(client: Client): Promise<void> {
  console.log("Registering commands...");
  const commandFiles = getFiles(path.join(__dirname, "..", "commands"));

  for (const commandFile of commandFiles) {
    const command = require(commandFile).default;
    commands.push(command);
  }

  //ajout des commandes de quiz
  const quizFiles = getFiles(path.join(__dirname, "../..", "assets/data/commands"), "json");
  for (const quizFile of quizFiles) {
    const data = await fs.readFile(quizFile, "utf8");
    const json = JSON.parse(data);
    commands.push(buildQuizCommand(json));
  }

  await registerSlashCommand(client);
  await registerPrefixCommand(client);
  
  console.log("Successfully registered commands!");
}

async function registerSlashCommand(client: Client) {
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);
  await rest.put(
    Routes.applicationGuildCommands("1240049211030896733", "728006388936081528"), 
    { body: commands.map(command => command.data.toJSON())}
  );

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
      try {
        const command = commands.find(command => command.data.name === interaction.commandName);
        if (command) {
          const args = command.transformOptionsToArgs ? command.transformOptionsToArgs(interaction) : [];
          await command.execute(interaction, args);
        }
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    } else {
      console.error(`Unknown interaction type: ${interaction.type}`);
    }
  });
}

async function registerPrefixCommand(client: Client) {
  client.on(Events.MessageCreate, async (message) => {
    if (!message.content.startsWith(process.env.PREFIX!)) return;
    const args = message.content.slice(process.env.PREFIX!.length).trim().split(/ +/);
    const commandName = args.shift()!.toLowerCase();
    const command = commands.find(command => command.data.name === commandName);
    if (command) {
      try {
        await command.execute(message, args);
      } catch (error) {
        console.error(error);
        await message.reply('There was an error while executing this command!');
      }
    }
  });
}