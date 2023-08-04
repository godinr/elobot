const { Client, Interaction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { color, footer} = require('../../configs/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('View points per win, loss, kill, loss & mvp.'),

    async execute(client, interaction){
        
        const pointsEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: 'Points', iconURL: client.user.displayAvatarURL()})
            .setDescription('Points awarded to players after each match')
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});

        const cachePoints = client.ranks.points;

        const points = {
            win: ['win', cachePoints.win],
            loss: ['loss', cachePoints.loss],
            kill: ['kill', cachePoints.kill],
            death: ['death', cachePoints.death],
            mvp: ['mvp', cachePoints.mvp]
        };

        for (const point in points){
            
            pointsEmbed.addFields({name: point, value: String(points[point][1]), inline: true})
        }

        pointsEmbed.addFields({name: '\u200B', value: '\u200B', inline: true})

        return await interaction.reply({embeds : [pointsEmbed]});
    }
}