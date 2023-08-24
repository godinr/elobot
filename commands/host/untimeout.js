const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');
const { color, footer } = require('../../configs/embeds');
const userSchema = require('../../schemas/user.schema');
const { numberTimeToText } = require('../../utils/conversion/timeConversion');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('untimeout member')
        .addUserOption(option => {
            return option
                .setName('user')
                .setDescription('Member you want to untimeout')
                .setRequired(true)
        })
        
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),

        async execute (client, interaction){

            try {
                const taggedUser = interaction.options.getUser('user');
                const taggedMember = await interaction.guild.members.fetch(taggedUser.id);
                

                if (!taggedMember){
                    return await interaction.reply({content: 'The user mentioned is not in the server', ephemeral: true});
                }

                if (!taggedMember.kickable){
                    return await interaction.reply({content: 'Cant timeout this user due to permissions', ephemeral: true});
                }

                if (interaction.member.id === taggedMember.id){
                    return await interaction.reply({content: 'Cant timeout yourself', ephemeral: true});
                }

                if (taggedMember.permissions.has(PermissionsBitField.Flags.MoveMembers)){
                    return await interaction.reply({content: 'Cant timeout a staff member', ephemeral: true});
                }

                if (taggedMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return await interaction.reply({ content: 'Cant timeout a admin member', ephemeral: true});
                }

                taggedMember.timeout(null);

                const timeoutEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({name: 'Timeout', iconURL: client.user.displayAvatarURL()})
                    .setDescription(`**${taggedMember.user.username}** timeout has been removed`)
                    .setTimestamp()
                    .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});

                return await interaction.reply({embeds: [timeoutEmbed]});

            } catch (err) {
                console.log('[CMD - Suspend] | Catch Error')
                console.log(err);
                return await interaction.reply({content: 'Something went wrong', ephemeral: true});
            }
        }
    }