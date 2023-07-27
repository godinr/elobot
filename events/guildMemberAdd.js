const { Client, GuildMember } = require('discord.js');
const UserSchema = require('../schemas/user.schema');

module.exports = {
    once: false,
    name: "guildMemberAdd",

    /**
     * @param {Client} client
     * @param {GuildMember} member 
     */
    async execute(client, member) {
        console.log(`[Event - GuildMemberAdd] | user: ${member.user.username} | id: ${member.id}`)
        
        try {
            const user = await UserSchema.findOne({id: member.id});

            if (!user){
                const unrankedRole = member.guild.roles.cache.find(r => r.name === 'Unranked');
                await member.roles.add(unrankedRole);
                return;
            }

            const rankRole = member.guild.roles.cache.find(r => r.name === user.rank);
            const rankedRole = member.guild.roles.cache.find(r => r.name === 'Ranked')


            try {
                await member.setNickname(`[${user.rating} ELO] ${member.user.username}`)
            } catch (error) {
                console.log('[Event - GuildMemberAdd] | Unable to change member nickname.')
            }

            if (user.suspended){
                const suspendedRole = member.guild.roles.cache.find(r => r.name === 'Suspended')
                await member.roles.add([rankRole, suspendedRole]);
                console.log('[Event - GuildMemberAdd] | Suspended member has rejoined the server.');
                return;
            }

            await member.roles.add([rankRole, rankedRole]);

        }catch(err){
            console.log('[Event - GuildMemberAdd] | Error giving roles.');
            console.log(err);
        }
        
        
        
        
    }
}