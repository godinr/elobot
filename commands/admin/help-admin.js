const { Client, Interaction, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { color, footer } = require('../../configs/embeds');
module.exports = {

    data: new SlashCommandBuilder()
        .setName('help-admin')
        .setDescription('Admin command helper')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){
        
        const adminEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: 'Admin Commands', iconURL: client.user.displayAvatarURL()})
            .setDescription('These commands are only available for admin / management roles')
            .setFields(
                { name: '/set-points', value: 'Modify points for wins, losses, kills, deaths and mvp'},
                { name: '/reset-profile @player', value: 'Completly reset the tagged player\'s profile'},
                { name: '/suspend @player [duration] [reason]', value: 'Suspend tagged player, player wont be able to join matches until duration has ended'},
                { name: '/unsuspend @player', value: 'Unsuspend tagged player before the duration ends'},
                { name: '/suspended-players', value: 'List of players with active suspensions and the duration in seconds.'}
            )
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});

        return await interaction.reply({embeds: [adminEmbed]});
    }
}