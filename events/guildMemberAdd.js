const { Client, GuildMember } = require('discord.js');

module.exports = {
    once: false,
    name: "guildMemberAdd",

    /**
     * @param {Client} client
     * @param {GuildMember} member 
     */
    async execute(client, member) {
        console.log(`New Guild Member | user: ${member.user.username} | id: ${member.id}`)
        const unrankedRole = client.guilds.cache.first().roles.cache.find(r => r.name === 'unranked');
        await member.roles.add(unrankedRole);
    }
}