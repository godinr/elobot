const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    Interaction, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    Client
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-points')
        .setDescription('Set points given to users for win, loss, kill, death, mvp.'),
        /**
         * 
         * @param {Client} client 
         * @param {Interaction} interaction 
         * @returns 
         */
    async execute(client, interaction){

        const pointsModal = new ModalBuilder()
            .setCustomId('set-points')
            .setTitle('Set Rank System Points')


        const winInput = new TextInputBuilder()
            .setCustomId('win')
            .setLabel("win points")
            .setStyle(TextInputStyle.Short)

        const lossInput = new TextInputBuilder()
            .setCustomId('loss')
            .setLabel("loss points")
            .setStyle(TextInputStyle.Short)
        
        
        const killInput = new TextInputBuilder()
            .setCustomId('kills')
            .setLabel("kill points")
            .setStyle(TextInputStyle.Short)
        
        const deathInput = new TextInputBuilder()
            .setCustomId('deaths')
            .setLabel("death points")
            .setStyle(TextInputStyle.Short)

        const mvpInput = new TextInputBuilder()
            .setCustomId('mvp')
            .setLabel("mvp points")
            .setStyle(TextInputStyle.Short)

        const row1 = new ActionRowBuilder().addComponents(winInput);
        const row2 = new ActionRowBuilder().addComponents(lossInput);
        const row3 = new ActionRowBuilder().addComponents(mvpInput);
        const row4 = new ActionRowBuilder().addComponents(killInput);
        const row5 = new ActionRowBuilder().addComponents(deathInput);

        pointsModal.addComponents(row1, row2, row3, row4, row5);

        return await interaction.showModal(pointsModal);
        
    }
}