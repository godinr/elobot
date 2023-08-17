const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { color, footer } = require('../../configs/embeds');
const UserSchema = require('../../schemas/user.schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unsuspend')
        .setDescription('unsuspend member')
        .addUserOption(option => {
            return option
                .setName('user')
                .setDescription('Member you want to unsuspend')
                .setRequired(true)
        })
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),
    
    async execute(client, interaction){
        const unsuspendedUser = interaction.options.getUser('user');
        const unsuspendedMember = await interaction.guild.members.fetch(unsuspendedUser);

        if (!unsuspendedMember){
            return await interaction.reply({content: 'This user is not in the server', ephemeral: true});
        }

        if (interaction.member.id === unsuspendedMember.id){
            return await interaction.reply({content: 'Cant unsuspend yourself', ephemeral: true });
        }

        const hasActiveTimeout = client.suspensionTimers.get(unsuspendedMember.id);

        if (hasActiveTimeout){
            clearTimeout(hasActiveTimeout)
            client.suspensionTimers.delete(unsuspendedMember.id)
            console.log('[CMD - Unsuspend] Timeout cleared');
        }

        const suspendedRole = interaction.guild.roles.cache.find(r => r.name === 'Suspended')
        const rankedRole = interaction.guild.roles.cache.find(r => r.name === 'Ranked')

        const rmSuspendedRole = unsuspendedMember.roles.remove(suspendedRole)
        const addRankedRoles = unsuspendedMember.roles.add(rankedRole)

        const user = await UserSchema.findOne({id: unsuspendedMember.id});

        if (!user){
            return await interaction.reply({content: 'User not found in DB'});
        }

        user.suspended = false;
        user.suspendedTime = 0;

        const res = user.save();

        await Promise.all([rmSuspendedRole, addRankedRoles, res]);

        const suspensionEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: 'Player Suspension', iconURL: client.user.displayAvatarURL() })
            .setTitle(`${unsuspendedMember.user.username} has been unsuspended`)
            .setDescription('Player is now able to play matches.\n Please avoid further suspensions.')
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()})
        
        return await interaction.reply({embeds: [suspensionEmbed]});
    }
}