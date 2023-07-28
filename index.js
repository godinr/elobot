require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

const { Client, Routes, Collection, GatewayIntentBits } = require('discord.js');
const { TOKEN, APP_ID, GUILD_ID } = process.env;
 const { registerCommands } = require('./utils/registerSlashCommands');
const { loadClientEvents } = require('./utils/loadEvents');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
    , rest: {version: '10'}
});

client.rest.setToken(TOKEN);

loadClientEvents(client);

async function main() {
    try {
        client.slashCommands = new Collection();
        await registerCommands(client);
        

        const commandsJson = client.slashCommands.map((cmd) => cmd.data.toJSON());
        
        await client.rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), {
            body: commandsJson,
        });

        const registeredCommands = await client.rest.get(Routes.applicationGuildCommands(APP_ID, GUILD_ID));
        //console.log(registeredCommands);
        
        await client.login(TOKEN);

    } catch (err) {
        console.log(err);
    }
}

main();


    