const { SlashCommandBuilder, Client, Interaction } = require('discord.js');
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
        }),

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
                return interaction.reply({content: 'Error, user account does not exist'});
            }
            const prevRank = user.rank;
            user.rank = 'D-';
            user.rating = 0;
            user.match_played = 0;
            user.wins = 0;
            user.losses = 0;
            user.kills = 0;
            user.deaths = 0;

            await user.save();
            //manage roles
            const guildUser = interaction.guild.members.cache.get(userId);
            const prevRankRole = interaction.guild.roles.cache.find(r => r.name === prevRank);
            const newRankRole = interaction.guild.roles.cache.find(r => r.name === 'D-');
            const removeOldRankRole = guildUser.roles.remove(prevRankRole);
            const addNewRankRole = guildUser.roles.add(newRankRole);

            await Promise.all([removeOldRankRole, addNewRankRole]);

            //update nickname
            const userNickname = guildUser.user.username;
            try{
                await guildUser.setNickname(`[0 ELO] ${userNickname}`);
            }catch(error){
                console.log('Permission error | unable to change user nickname')
            }

            return interaction.reply({content: `${guildUser.user.username}'s account has been reset.`});
        }catch(err){
            console.log(err);
            return interaction.reply({content: 'Error, unable to reset account'})
        }
    }
}