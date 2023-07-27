const { Client, GuildMember } = require('discord.js');

module.exports = {
    once: false,
    name: 'guildMemberRemove',

    /**
     * 
     * @param {Client} client 
     * @param {GuildMember} member 
     */
    async execute(client, member){

        const activeTimer = client.suspensionTimers.get(member.id);
        if (activeTimer){
            clearTimeout(activeTimer);
            console.log(`[Event - GuildMemberRemove] | ${member.id} left while suspended`);
            client.suspensionTimers.delete(member.id)
        }
    }
}