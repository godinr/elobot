const { Client, Interaction, EmbedBuilder, SlashCommandBuilder, PermissionsBitField, blockQuote } = require('discord.js');
const { color, footer} = require('../../configs/embeds');
const UserSchema = require('../../schemas/user.schema');
const { numberTimeToText } = require('../../utils/conversion/timeConversion');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('suspended-players')
        .setDescription('List all suspended players')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){

        const suspendedMembersEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: 'List of currently suspended players', iconURL: client.user.displayAvatarURL()})
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});
        try {
            const list = await UserSchema.find({suspended: true}).limit(20);
            
            if (list.length === 0){
                suspendedMembersEmbed.setDescription(`Total suspended members: **${list.length}**`)
                return interaction.reply({embeds: [suspendedMembersEmbed]});
            }


            suspendedMembersEmbed.setDescription(`Total suspended members: **${list.length}**`)
            
            let suspension;

            list.forEach((user) => {
                suspension = user.suspensions[user.suspensions.length-1];
                suspendedMembersEmbed.addFields(
                    { 
                        name: `${user.username}`, 
                        value: blockQuote(`Suspended for **${numberTimeToText(suspension.suspendedTime)}**\n Suspended on **${suspension.suspendedDate}**\nReason: **${suspension.suspendedReason}**`) 
                    }
                )
            })
            

            return await interaction.reply({embeds: [suspendedMembersEmbed]});
        }catch(err){
            console.log('[CMD - Suspended-Players] | Catch Error')
            console.log(err);
        }
        

        return await interaction.reply('leaderboard test');
    }
}