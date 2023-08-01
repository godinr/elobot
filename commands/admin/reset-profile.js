const { SlashCommandBuilder, Client, Interaction, PermissionsBitField } = require('discord.js');
const UserSchema = require('../../schemas/user.schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-profile')
        .setDescription('Reset player\'s rank profile.')
        .addUserOption(option => {
            return option
                .setName('user')
                .setDescription('The user\'s profile you want to reset.')
                .setRequired(true)
        })
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @returns 
     */
    async execute(client, interaction){

        const userId = interaction.options.getUser('user').id;

        try {
            const user = await UserSchema.findOne({id: userId});

            if (!user){
                return await interaction.reply({content: 'Error, user account does not exist'});
            }

            const prevRank = user.rank;
            user.rank = 'D-';
            user.rating = 0;
            user.match_played = 0;
            user.wins = 0;
            user.losses = 0;
            user.kills = 0;
            user.deaths = 0;
            user.matches = [];

            //manage roles
            const guildUser = await interaction.guild.members.fetch(userId);
            const prevRankRole = interaction.guild.roles.cache.find(r => r.name === prevRank);
            const newRankRole = interaction.guild.roles.cache.find(r => r.name === 'D-');
            const removeOldRankRole = guildUser.roles.remove(prevRankRole);
            const addNewRankRole = guildUser.roles.add(newRankRole);

            await Promise.all([removeOldRankRole, addNewRankRole]);

            //update nickname
            const username = guildUser.user.username;

            if (guildUser.permissions.has('ManageNicknames')){
                        console.log('[CMD - Reset-Profile] | Unable to change user nickname');
                        
            }else {
                await guildUser.setNickname(`[${user.rating} ELO] ${username}`);
                console.log('[CMD - Reset-Profile] | Changed user nickname')
            }

            await user.save();

            return await interaction.reply({content: `${username}'s account has been reset.`});
        }catch(err){
            console.log(err);
        }
    }
}