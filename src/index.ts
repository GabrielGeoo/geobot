import { Client, GatewayIntentBits } from "discord.js";
import startBackgroundWorker from "./background_worker";

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
    startBackgroundWorker();
    client.login(process.env.BOT_TOKEN);
    console.log('Bot started!');
  } catch (error) {
    console.log('Error when running the bot:');
    console.error(error);
  }
}

main();