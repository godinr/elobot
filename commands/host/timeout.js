const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');
const { color, footer } = require('../../configs/embeds');
const userSchema = require('../../schemas/user.schema');
const { numberTimeToText } = require('../../utils/conversion/timeConversion');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('timeout member')
        .addUserOption(option => {
            return option
                .setName('user')
                .setDescription('Member you want to timeout')
                .setRequired(true)
        })
        .addStringOption(option => {
            return option
                .setName('duration')
                .setDescription('duration of the timeout')
                .setRequired(true)
                .addChoices(
                    { name: '1 minute', value: '60' },
                    { name: '2 minutes', value: '120' },
                    { name: '5 minutes', value: '300' },
                    { name: '10 minutes', value: '600' },
                    { name: '30 minutes', value: '1800' },
                    { name: '1 hour', value: '3600' },
                    { name: '2 hours', value: '7200' },
                    { name: '5 hours', value: '18000' },
                    { name: '10 hours', value: '36000' },
                    { name: '15 hours', value: '54000' },
                    { name: '1 day', value: '86400'},
                    { name: '3 day', value: '259200'},
                    { name: '7 day', value: '604800'},
                    { name: '14 day', value: '1209600'},
                    { name: '21 day', value: '1814400'},

                )
        })
        .addStringOption(option => {
            return option
                .setName('reason')
                .setDescription('reason for the timeout')
        })
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),

        async execute (client, interaction){

            try {
                const taggedUser = interaction.options.getUser('user');
                const taggedMember = await interaction.guild.members.fetch(taggedUser.id);
                const duration = interaction.options.getString('duration');
                const reason = interaction.options.getString('reason') || 'none';

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

                taggedMember.timeout(duration * 1000, reason);

                const timeoutEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({name: 'Timeout', iconURL: client.user.displayAvatarURL()})
                    .setDescription(`**${taggedMember.user.username}** has been timed out for **${numberTimeToText(duration)}**`)
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