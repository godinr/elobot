const { SlashCommandBuilder, Client, Interaction, EmbedBuilder } = require('discord.js');
const UserSchema = require('../../schemas/user.schema');
const { color, footer } = require('../../configs/embeds');

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
            .setColor(color)
            .setAuthor({name: 'Join Rank System', iconURL: client.user.displayAvatarURL()})
            .setTimestamp()
            .setFooter({ text: footer, iconURL: client.user.displayAvatarURL()})

        // check if user is new
        const userId = interaction.member.id;

        UserSchema.findOne({id: userId}).then(async (res) => {
            if (res){
                joinEmbed.setTitle('❌ You already have a rank profile.')
                joinEmbed.setDescription('To reset your account contact Management')
                return await interaction.reply({embeds: [joinEmbed]})
            }
            
            const user = new UserSchema({
                id: userId,
                username: interaction.member.user.username,
                rank: 'D-',
                rating: 0,
                match_played: 0,
                wins: 0,
                losses: 0,
                kills: 0,
                deaths: 0,
                suspended: false,
                suspendedTime: 0
            })

            const rankedRole = interaction.guild.roles.cache.find(r => r.name === 'Ranked');
            const unrankedRole = interaction.guild.roles.cache.find(r => r.name === 'Unranked');
            const currentRankRole = interaction.guild.roles.cache.find(r => r.name === 'D-');

            await interaction.member.roles.remove(unrankedRole);
            await interaction.member.roles.add([rankedRole, currentRankRole]);

            const userNickname = interaction.member.user.username;

            try{
                await interaction.member.setNickname(`[${user.rating} ELO] ${userNickname}`);
            }catch(err){
                console.log('[CMD - Join] | Unable to change user nickname')
            }

            // await Promise.all([removeUnrankedRole, addRankedRoles]);
            const kd = 0.0;
            joinEmbed.setTitle("✅ Profile created");
            joinEmbed.setFields(
                { name: 'Rank', value: user.rank, inline: true},
                { name: 'Rating', value: String(user.rating), inline: false},
                { name: 'Match', value: String(user.match_played), inline: true},
                { name: 'Wins', value: String(user.wins), inline: true},
                { name: 'Losses', value: String(user.losses), inline: true},
                { name: 'K/D', value: String(kd), inline: true},
                { name: 'Kills', value: String(user.kills), inline: true},
                { name: 'Deaths', value: String(user.deaths), inline: true},
            )
            await user.save()

            console.log(`[CMD - Join] id: ${userId}, username: ${interaction.member.user.username}`)
            return await interaction.reply({embeds: [joinEmbed]});


        })

    },

};