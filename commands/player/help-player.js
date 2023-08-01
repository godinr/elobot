const { Client, Interaction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { color, footer } = require('../../configs/embeds');
module.exports = {

    data: new SlashCommandBuilder()
        .setName('help-player')
        .setDescription('Player command helper'),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){
        
        const playerEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: 'Player Commands', iconURL: client.user.displayAvatarURL()})
            .setDescription('These commands are available to everyone')
            .setFields(
                { name: '/join', value: 'Create a rank profile in the database.\nAll players will need to use this command once to be eligible to play matches'},
                { name: '/profile @player', value: 'View your profile stats or tag a player to view their profile stats.'},
                { name: '/matches @player', value: 'View your last matches or tag a player to view their last matches.'},
                { name: '/leaderboard', value: 'Leaderboard of top 10 players'},
                { name: '/ranks', value: 'View all the ranks, and the required elo to get the rank.'},
                { name: '/about', value: 'Information about Elo bot.'}
            )
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});

        return await interaction.reply({embeds: [playerEmbed]});
    }
}