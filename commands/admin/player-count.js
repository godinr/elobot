const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    PermissionsBitField, 
    Client, 
    Interaction
} = require('discord.js');

const UserSchema = require('../../schemas/user.schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player-count')
        .setDescription('Returns the numbers of players who used /join')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames),
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){

        try {

            const users = await UserSchema.find({});

            if (!users){
                console.log('[CMD - Player-Count] | No users found');
                return interaction.reply({content: '0 Players'});
            }

            return interaction.reply({content: `Player count: ${users.length}`});
        }catch(err){
            console.log(err);
        }
    }
}