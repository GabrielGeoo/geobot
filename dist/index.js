"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require('dotenv').config();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ]
});
async function main() {
    try {
        console.log('Starting bot...');
        client.login(process.env.BOT_TOKEN);
        console.log('Bot started!');
    }
    catch (error) {
        console.log('Error when running the bot:');
        console.error(error);
    }
}
main();
