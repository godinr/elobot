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

        // const cqcWinInput = new TextInputBuilder()
        //     .setCustomId('cqcwin')
        //     .setLabel("cqc win points")
        //     .setStyle(TextInputStyle.Short)

        // const cqcLossInput = new TextInputBuilder()
        //     .setCustomId('cqcloss')
        //     .setLabel("cqc loss points")
        //     .setStyle(TextInputStyle.Short)
        
        const mvpInput = new TextInputBuilder()
            .setCustomId('mvp')
            .setLabel("mvp points")
            .setStyle(TextInputStyle.Short)
        
        const killInput = new TextInputBuilder()
            .setCustomId('kills')
            .setLabel("kill points")
            .setStyle(TextInputStyle.Short)
        
        const deathInput = new TextInputBuilder()
            .setCustomId('deaths')
            .setLabel("death points")
            .setStyle(TextInputStyle.Short)

        
        const row = new ActionRowBuilder().addComponents(winInput);
        const row1 = new ActionRowBuilder().addComponents(lossInput);
        //const row2 = new ActionRowBuilder().addComponents(cqcWinInput);
        //const row3 = new ActionRowBuilder().addComponents(cqcLossInput);
        const row4 = new ActionRowBuilder().addComponents(mvpInput);
        const row5 = new ActionRowBuilder().addComponents(killInput);
        const row6 = new ActionRowBuilder().addComponents(deathInput);

        pointsModal.addComponents(row, row1, row4, row5, row6);

        return await interaction.showModal(pointsModal);
        
    }
}