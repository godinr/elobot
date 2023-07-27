const { Client, Interaction, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { color, footer } = require('../../configs/embeds');
module.exports = {

    data: new SlashCommandBuilder()
        .setName('help-host')
        .setDescription('Host command helper')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){
        
        const hostEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: 'Host Commands', iconURL: client.user.displayAvatarURL()})
            .setDescription('These commands are only available for Match Host & management roles')
            .setFields(
                { name: '/create-teams', value: 'Generate Teams with player connected to Awaiting Match voice channel.\nWill also move the members in the assigned Squad Room 1 & Squad Room 2.'},
                { name: '/add-match @player', value: 'Add post match stats to tagged player\'s profile. This command should be used after each match for each player'},
                { name: '/fix-profile @player', value: 'Adjust win, loss, kills, deaths of tagged player\'s profile.'},


            )
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});

        return await interaction.reply({embeds: [hostEmbed]});
    }
}