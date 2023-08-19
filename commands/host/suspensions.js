const { Client, Interaction, EmbedBuilder, SlashCommandBuilder, PermissionsBitField, blockQuote } = require('discord.js');
const { color, footer} = require('../../configs/embeds');
const UserSchema = require('../../schemas/user.schema');
const { numberTimeToText } = require('../../utils/conversion/timeConversion');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('suspensions')
        .setDescription('List all suspensions for a player')
        .addUserOption(option => {
            return option
                .setName('user')
                .setDescription('Member you want to see suspensions for')
                .setRequired(true)
        })
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){

        const suspendedMembersEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: 'List of all suspensions for a player', iconURL: client.user.displayAvatarURL()})
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});
        try {
            const suspendedUser = interaction.options.getUser('user');
            const suspendedMember = await interaction.guild.members.fetch(suspendedUser.id);


            const user = await UserSchema.findOne({id: suspendedUser.id});

            if (!user){
                return await interaction.reply({content: 'User not found in DB'});
            }

            const list = user.suspensions;
            
            if (list.length === 0){
                suspendedMembersEmbed.setDescription(`Suspensions for **${suspendedMember.user.username}**\nTotal suspensions: **${list.length}**`)
                return interaction.reply({embeds: [suspendedMembersEmbed]});
            }


            suspendedMembersEmbed.setDescription(`Suspensions for **${suspendedMember.user.username}**\nTotal suspensions: **${list.length}**`)
            

            list.forEach((suspension, i) => {
                
                suspendedMembersEmbed.addFields(
                    { 
                        name: `${i+1}`, 
                        value: blockQuote(`Suspended for **${numberTimeToText(suspension.suspendedTime)}**\n Suspended on **${suspension.suspendedDate}**\nReason: **${suspension.suspendedReason}**`) 
                    }
                )
            })
            

            return await interaction.reply({embeds: [suspendedMembersEmbed]});
        }catch(err){
            console.log('[CMD - Suspensions] | Catch Error')
            console.log(err);
            return await interaction.reply({content: 'Something went wrong', ephemeral: true});
        }
    }
}