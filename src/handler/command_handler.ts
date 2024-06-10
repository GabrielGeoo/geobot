import { ChatInputCommandInteraction, Client, Events, REST, Routes } from "discord.js";
import getFiles from "../utils/get_files";
import path from "path";
import buildQuizCommand from "../utils/quiz_command_builder";
import * as fs from "fs/promises";
import commands from "../utils/get_commands";
import config from '../../assets/config.json';
import Log from "../models/Log";
require('dotenv').config();

export default async function registerCommands(client: Client): Promise<void> {
  console.log("Registering commands...");
  const commandFiles = getFiles(path.join(__dirname, "..", "commands"));

  for (const commandFile of commandFiles) {
    const command = require(commandFile).default;
    commands.add(command);
  }

  //ajout des commandes de quiz
  const quizFiles = getFiles(path.join(__dirname, "../..", "assets/data/commands"), "json");
  for (const quizFile of quizFiles) {
    const data = await fs.readFile(quizFile, "utf8");
    const json = JSON.parse(data);
    commands.add(buildQuizCommand(json));
  }

  await registerSlashCommand(client);
  await registerPrefixCommand(client);
  
  console.log("Successfully registered commands!");
}

async function registerSlashCommand(client: Client) {
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);
  await rest.put(
    Routes.applicationGuildCommands(process.env.BOT_ID ?? config.botId, process.env.GUILD_ID ?? config.guildId), 
    { body: commands.get().map(command => command.data.toJSON())}
  );

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
      try {
        const command = commands.get().find(command => command.data.name === interaction.commandName);
        if (command) {
          const args = command.transformOptionsToArgs ? command.transformOptionsToArgs(interaction) : [];
          if ((interaction as ChatInputCommandInteraction).options.getSubcommand(false)) args.unshift((interaction as ChatInputCommandInteraction).options.getSubcommand());
          await command.execute(interaction, args);
        }
      } catch (error) {
        console.error(error);
        await handleError(error);
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
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift()!.toLowerCase();
    const command = commands.get().find(command => command.data.name === commandName);
    if (command) {
      if (command.permissions && !message.member?.permissions.has(command.permissions)) {
        await message.reply("Vous n'avez pas la permission d'exécuter cette commande");
        return;
      }
      try {
        if (command.quizCommand) {
          await Log.create({
            message: "Un quiz '" + command.data.name + "' a été lancé par " + message.author.username + " dans le channel " + message.channel.id + " venant du message " + message.id,
            date: new Date()
          });
        }
        await command.execute(message, args);
      } catch (error) {
        console.error(error);
        await handleError(error);
        await message.reply('There was an error while executing this command!');
      }
    }
  });
}

async function handleError(error: any) {
  if (error instanceof Error) {
    await Log.create({
      name: error.name,
      message: error.message,
      stack: error.stack,
      date: new Date()
    });
  } else {
    await Log.create({
      message: error,
      date: new Date()
    });
  }
}
