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
        .setName('set-points')
        .setDescription('Set points given to users for win, loss, kill, death, mvp.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames),
        /**
         * 
         * @param {Client} client 
         * @param {Interaction} interaction 
         * @returns 
         */
    async execute(client, interaction){

        const cachedPoints = client.ranks.points;
        
        const pointValues = {
            win: String(cachedPoints.win),
            loss: String(cachedPoints.loss),
            kill: String(cachedPoints.kill),
            death: String(cachedPoints.death),
            mvp: String(cachedPoints.mvp)
        }

        const pointsModal = new ModalBuilder()
            .setCustomId('set-points')
            .setTitle('Set Rank System Points')


        const winInput = new TextInputBuilder()
            .setCustomId('win')
            .setLabel("win points")
            .setStyle(TextInputStyle.Short)
            .setValue(pointValues.win)

        const lossInput = new TextInputBuilder()
            .setCustomId('loss')
            .setLabel("loss points")
            .setStyle(TextInputStyle.Short)
            .setValue(pointValues.loss)
        
        
        const killInput = new TextInputBuilder()
            .setCustomId('kills')
            .setLabel("kill points")
            .setStyle(TextInputStyle.Short)
            .setValue(pointValues.kill)
        
        const deathInput = new TextInputBuilder()
            .setCustomId('deaths')
            .setLabel("death points")
            .setStyle(TextInputStyle.Short)
            .setValue(pointValues.death)

        const mvpInput = new TextInputBuilder()
            .setCustomId('mvp')
            .setLabel("mvp points")
            .setStyle(TextInputStyle.Short)
            .setValue(pointValues.mvp)

        const row1 = new ActionRowBuilder().addComponents(winInput);
        const row2 = new ActionRowBuilder().addComponents(lossInput);
        const row3 = new ActionRowBuilder().addComponents(mvpInput);
        const row4 = new ActionRowBuilder().addComponents(killInput);
        const row5 = new ActionRowBuilder().addComponents(deathInput);

        pointsModal.addComponents(row1, row2, row3, row4, row5);

        return await interaction.showModal(pointsModal);
        
    }
}