const { SlashCommandBuilder, Client, Interaction, EmbedBuilder } = require('discord.js');
const UserSchema = require('../../schemas/user.schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('join rank system'),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){

        const joinEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Join rank system')
            .setAuthor({name: 'Elo', iconURL: client.user.iconURL})
            .setTimestamp()
            .setFooter({ text: 'Elo bot', iconURL: client.user.iconURL})

        // check if user is new
        const userId = interaction.member.id;

        UserSchema.findOne({id: userId}).then(async (res) => {
            if (res){
                joinEmbed.setDescription('You already have a rank profile, unable to create a new one.')
                interaction.reply({embeds: [joinEmbed]})
                return;
            }
            
            const user = new UserSchema({
                id: userId,
                rank: 'D-',
                rating: 0,
                match_played: 0,
                wins: 0,
                losses: 0,
                kills: 0,
                deaths: 0
            })

            const rankedRole = interaction.guild.roles.cache.find(r => r.name === 'ranked');
            const unrankedRole = interaction.guild.roles.cache.find(r => r.name === 'unranked');
            const currentRankRole = interaction.guild.roles.cache.find(r => r.name === 'D-');

            const removeUnrankedRole = interaction.member.roles.remove(unrankedRole);
            const addRankedRoles = interaction.member.roles.add([rankedRole, currentRankRole]);
            const userNickname = interaction.member.user.username;

            try{
                await interaction.member.setNickname(`ELO: ${user.rating} | ${userNickname}`);
            }catch(err){
                console.log('unable to change user nickname')
            }

            user.save().then(async () => {
                // modify user roles
                await Promise.all([removeUnrankedRole, addRankedRoles]);
                
                joinEmbed.setDescription("Rank profile created")
                interaction.reply({embeds: [joinEmbed]})
                return;
            })


        })

    },

};