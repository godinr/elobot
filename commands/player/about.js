const { Client, Interaction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { color} = require('../../configs/embeds');
module.exports = {

    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Information about this bot'),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){
        
        const playerEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: 'Information about Elo bot', iconURL: client.user.displayAvatarURL()})
            .setDescription('**Built exclusively for Apocalypse Rising: Matchmaking Discord Server.**')
            .setFields(
                { name: 'Elo', value: 'After each match, a match host will update your profile with you match stats'},
                { name: 'Ranks', value: 'Each rank needs a set amount of elo to get promoted'},
                { name: 'Roles', value: 'After each promotion, rank roles are automatically assigned to your account.\nElo will update after each match.'},
            )
            .setTimestamp()
            .setFooter({text: 'dev: friedclam', iconURL: client.user.displayAvatarURL()});

        return await interaction.reply({embeds: [playerEmbed]});
    }
}