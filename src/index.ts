import { Client, GatewayIntentBits } from "discord.js";
import registerCommands from "./handler/command_handler";
import registerEvents from "./handler/event_handler";
import startBackgroundWorker from "./site/background_worker";
import mongoose from "mongoose";
import log from "./utils/log";
import { GridFSBucket } from 'mongodb';
import FileHandler from "./handler/file_handler";

require('dotenv').config();

process.on('unhandledRejection', (reason, promise) => {
  log(client, "Unhandled rejection", `Unhandled rejection at: ${promise.toString()}, reason: ${reason}`);
});
process.on('uncaughtException', (error, origin) => {
  log(client, "Uncaught exception", `Caught exception: ${error}, origin: ${origin}`);
});
process.on('exit', (code) => {
  log(client, "Bot is offline", `Bot is offline with code ${code}`);
});
process.on('warning', (...args) => {
  log(client, "Warning", `Warning: ${args}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ]
});

let gfs: GridFSBucket;

async function main() {
  try {
    console.log('Starting bot...');
    await mongoose.connect(process.env.MONGODB_URI!, {dbName: "GeoBot"});
    console.log('Connected to MongoDB');
    gfs = new GridFSBucket(mongoose.connection.db, { bucketName: 'images' });
    FileHandler.init(gfs);
    await registerEvents(client);
    await registerCommands(client);
    client.login(process.env.BOT_TOKEN);
    console.log('Bot started');
  } catch (error) {
    console.log('Error when running the bot:');
    console.error(error);
    log(client, "Error when running the bot", `Error: ${error}`);
  }
}

startBackgroundWorker();
main();