const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');
const { color, footer } = require('../../configs/embeds');
const userSchema = require('../../schemas/user.schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suspend')
        .setDescription('suspend member')
        .addUserOption(option => {
            return option
                .setName('user')
                .setDescription('Member you want to suspend')
                .setRequired(true)
        })
        .addStringOption(option => {
            return option
                .setName('duration')
                .setDescription('duration of the suspension')
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
                    { name: '28 day', value: '2419200'},

                )
        })
        .addStringOption(option => {
            return option
                .setName('reason')
                .setDescription('readon for the suspension')
        })
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames),

        async execute (client, interaction){

            const suspendedUser = interaction.options.getUser('user');
            const suspendedMember = await interaction.guild.members.fetch(suspendedUser.id);
            const duration = interaction.options.getString('duration');
            const reason = interaction.options.getString('reason') || 'none';

            if (!suspendedMember){
                return await interaction.reply({content: 'The user mentioned is not in the server', ephemeral: true});
            }

            if (!suspendedMember.kickable){
                return await interaction.reply({content: 'Cant suspend this user due to permissions', ephemeral: true});
            }

            if (interaction.member.id === suspendedMember.id){
                return await interaction.reply({content: 'Cant suspend yourself', ephemeral: true});
            }

            if (suspendedMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({ content: 'Cant suspend a admin member', ephemeral: true});
            }

            const suspendedRole = interaction.guild.roles.cache.find(r => r.name === 'Suspended')
            const rankedRole = interaction.guild.roles.cache.find(r => r.name === 'Ranked')
            const addSuspendedRole = suspendedMember.roles.add(suspendedRole);
            const rmRankedRole = suspendedMember.roles.remove(rankedRole);

            const user = await userSchema.findOne({id: suspendedMember.id});

            if (!user){
                return interaction.reply({content: 'User not found in DB'})
            }

            user.suspended = true;

            const res = user.save();

            await Promise.all([addSuspendedRole, rmRankedRole, res])

            const suspensionEmbed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: 'Player Suspension', iconURL: client.user.displayAvatarURL() })
                .setTitle(`${suspendedMember.user.username} has been suspended`)
                .setDescription(`Duration: ${duration} seconds\nReason: ${reason}`)
                .setTimestamp()
                .setFooter({text: footer, iconURL: client.user.displayAvatarURL()})
            
            console.log(`[CMD - Suspend] | ${suspendedMember.id} suspended & removed ranked role`);
            
            const timer = setTimeout(async () => {

                const rmSuspendedRole = suspendedMember.roles.remove(suspendedRole);
                const addRankedRole = suspendedMember.roles.add(rankedRole);
                
                const user = await userSchema.findOne({id: suspendedMember.id});
                user.suspended = false;
                const res = user.save();
                
                await Promise.all([rmSuspendedRole, addRankedRole, res]);
                
                suspensionEmbed.setTitle(`${suspendedMember.user.username} has been unsuspended`);
                suspensionEmbed.setDescription('Player is now able to play matches.\n Please avoid further suspensions.');
                
                console.log(`[CMD - Suspend] | ${suspendedMember.id} unsuspended & added ranked role`);

                client.suspensionTimers.delete(suspendedMember.id);
                interaction.channel.send({embeds: [suspensionEmbed]});
            }, duration * 1000)

            client.suspensionTimers.set(suspendedMember.id, timer);
            return await interaction.reply({embeds: [suspensionEmbed]});
        }

}