const { Client, Interaction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { color, footer} = require('../../configs/embeds');
const UserSchema = require('../../schemas/user.schema');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Leaderboard of top 10 players in the server.'),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){

        const leaderboardEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: 'Leaderboard - Top 10 Player\'s', iconURL: client.user.displayAvatarURL()})
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});
            
        try {
            const top10 = await UserSchema.find().sort({rating: -1}).limit(10);
            
            for(let i = 0; i < top10.length-1; i++){
                leaderboardEmbed.addFields(
                    { name: `${i+1}: ${top10[i].rank}  ${top10[i].rating} ELO ${top10[i].username}`, value: `${i+2}: ${top10[i+1].rank}  ${top10[i+1].rating} ELO ${top10[i+1].username}` }
                )
                i++;
            }
                

            return await interaction.reply({embeds: [leaderboardEmbed]});
        }catch(err){
            console.log('[CMD - Leaderboard] | Catch Error')
            console.log(err);
        }
    }
}