const {Client, Interaction} = require('discord.js')

module.exports = {
    once: false,
    name: "interactionCreate",
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){
        if (interaction.isChatInputCommand()){
            const { commandName } = interaction;
            const cmd = client.slashCommands.get(commandName);
    
            if (cmd){
                cmd.execute(client, interaction);
            } else {
                interaction.reply({ content: "This command has no run method."});
            }
        }

        if(interaction.isModalSubmit()){
            if(interaction.customId === "add-match"){
                console.log('from interaction create')
                
                const userId = interaction.fields.getTextInputValue('userId');
                const mvp = interaction.fields.getTextInputValue('mvp');
                const winMatch = interaction.fields.getTextInputValue('win');
                const kills = interaction.fields.getTextInputValue('kills');
                const deaths = interaction.fields.getTextInputValue('deaths');


                // todo update db
                console.log(userId);
                console.log(`win: ${winMatch}`);
                console.log(`mvp: ${mvp}`)
                console.log(`kills: ${kills}`);
                console.log(`deaths: ${deaths}`);


                await interaction.reply({content: 'Player stats updated'});
            }

            if(interaction.customId === "set-points"){
                // todo update db with values 

            }
        }
    }
}