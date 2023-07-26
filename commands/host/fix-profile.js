const { 
    SlashCommandBuilder, 
    Client, 
    Interaction, 
    ModalBuilder, 
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    PermissionsBitField
} = require('discord.js');

const UserSchema = require('../../schemas/user.schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fix-profile')
        .setDescription('Fix player\'s rank values.')
        .addUserOption(option => {
            return option
                .setName('user')
                .setDescription('The user\'s profile you want to update.')
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

        try {
            const user = await UserSchema.findOne({id: userId});

            if (!user){
                return interaction.reply({content: 'Error, user account does not exist'});
            }
    
            const profileModal = new ModalBuilder()
                .setCustomId('fix-profile')
                .setTitle('Fix Player Stats')
    
    
            const winsInput = new TextInputBuilder()
                .setCustomId('wins')
                .setLabel("wins")
                .setStyle(TextInputStyle.Short)
                .setValue(String(user.wins))

            const lossesInput = new TextInputBuilder()
                .setCustomId('losses')
                .setLabel("losses")
                .setStyle(TextInputStyle.Short)
                .setValue(String(user.losses))
            
            
            const killsInput = new TextInputBuilder()
                .setCustomId('kills')
                .setLabel("kills")
                .setStyle(TextInputStyle.Short)
                .setValue(String(user.kills))
            
            const deathsInput = new TextInputBuilder()
                .setCustomId('deaths')
                .setLabel("deaths")
                .setStyle(TextInputStyle.Short)
                .setValue(String(user.deaths))

            const UserIdInput = new TextInputBuilder()
                .setCustomId('userId')
                .setLabel("***DO NOT CHANGE USER ID BELLOW***")
                .setValue(userId)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
    
            const row1 = new ActionRowBuilder().addComponents(winsInput);
            const row2 = new ActionRowBuilder().addComponents(lossesInput);
            const row3 = new ActionRowBuilder().addComponents(killsInput);
            const row4 = new ActionRowBuilder().addComponents(deathsInput);
            const row5 = new ActionRowBuilder().addComponents(UserIdInput);
    
            profileModal.addComponents(row1, row2, row3, row4, row5);
    
            return await interaction.showModal(profileModal);
            
        }catch(err){
            console.log(err);
            return interaction.reply({content: 'Error, unable to reset account'})
        }
    }
}