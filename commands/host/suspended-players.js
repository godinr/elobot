const { Client, Interaction, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { color, footer} = require('../../configs/embeds');
const UserSchema = require('../../schemas/user.schema');

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
                suspendedMembersEmbed.setDescription("No members currently suspended")
                return interaction.reply({embeds: [suspendedMembersEmbed]});
            }

            let description = "";
            
            list.forEach((user) => {
                description += `${user.username}, duration: ${user.suspendedTime}\n`;
            })

            suspendedMembersEmbed.setDescription(description);
                

            return await interaction.reply({embeds: [suspendedMembersEmbed]});
        }catch(err){
            console.log('[CMD - Suspended-Players] | Catch Error')
            console.log(err);
        }
        

        return await interaction.reply('leaderboard test');
    }
}