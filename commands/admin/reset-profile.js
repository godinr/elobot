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

            const res = user.save();
            //manage roles
            const guildUser = await interaction.guild.members.fetch(userId);
            const prevRankRole = interaction.guild.roles.cache.find(r => r.name === prevRank);
            const newRankRole = interaction.guild.roles.cache.find(r => r.name === 'D-');
            const removeOldRankRole = guildUser.roles.remove(prevRankRole);
            const addNewRankRole = guildUser.roles.add(newRankRole);

            await Promise.all([removeOldRankRole, addNewRankRole, res]);

            //update nickname
            const userNickname = guildUser.user.username;
            try{
                await guildUser.setNickname(`[0 ELO] ${userNickname}`);
            }catch(error){
                console.log('[CMD - Reset-Profile] | Permission error > unable to change user nickname')
            }

            return await interaction.reply({content: `${guildUser.user.username}'s account has been reset.`});
        }catch(err){
            console.log(err);
        }
    }
}