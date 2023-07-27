const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    Interaction, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    Client,
    PermissionsBitField
} = require('discord.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-match')
        .setDescription('Update player stats after they played a match')
        .addUserOption(option => {
            return option
                .setName('user')
                .setDescription('The user you want to add match stats')
                .setRequired(true)
        })
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),
        /**
         * 
         * @param {Client} client 
         * @param {Interaction} interaction 
         * @returns 
         */
    async execute(client, interaction){


        const userId = interaction.options.getUser('user').id;
        

        const statsModal = new ModalBuilder()
            .setCustomId('add-match')
            .setTitle('Match Results')


        const winInput = new TextInputBuilder()
            .setCustomId('win')
            .setLabel("win? (Y/N)")
            .setMaxLength(1)
            .setValue('Y')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const mvpInput = new TextInputBuilder()
            .setCustomId('mvp')
            .setLabel("mvp? (Y/N)")
            .setMaxLength(1)
            .setValue("N")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const killInput = new TextInputBuilder()
            .setCustomId('kills')
            .setLabel("kill count")
            .setMaxLength(3)
            .setValue("0")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const deathInput = new TextInputBuilder()
            .setCustomId('deaths')
            .setLabel("death count")
            .setMaxLength(3)
            .setValue("0")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const UserIdInput = new TextInputBuilder()
            .setCustomId('userId')
            .setLabel("***DO NOT CHANGE USER ID BELLOW***")
            .setValue(userId)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const row1 = new ActionRowBuilder().addComponents(winInput);
        const row2 = new ActionRowBuilder().addComponents(mvpInput);
        const row3 = new ActionRowBuilder().addComponents(killInput);
        const row4 = new ActionRowBuilder().addComponents(deathInput);
        const row5 = new ActionRowBuilder().addComponents(UserIdInput);

        statsModal.addComponents(row1, row2, row3, row4, row5);

        return await interaction.showModal(statsModal);
        
    }
}