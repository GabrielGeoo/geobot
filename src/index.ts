import { Client, GatewayIntentBits } from "discord.js";
import registerCommands from "./handler/command_handler";
import registerEvents from "./handler/event_handler";
import startBackgroundWorker from "./site/background_worker";
import mongoose from "mongoose";

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ]
});

async function main() {
  try {
    console.log('Starting bot...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');
    await registerEvents(client);
    await registerCommands(client);
    client.login(process.env.BOT_TOKEN);
    console.log('Bot started');
  } catch (error) {
    console.log('Error when running the bot:');
    console.error(error);
  }
}

startBackgroundWorker();
main();