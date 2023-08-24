const { Client, Interaction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { color, footer} = require('../../configs/embeds');
const UserSchema = require('../../schemas/user.schema');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Leaderboard of top 10 players in the server.')
        .addStringOption(option => {
            return option
                .setName('pages')
                .setDescription('pages of the leaderboard')
                .addChoices(
                    { name: 'Top 10', value: '0, 10' },
                    { name: 'from 1 to 25', value: '0, 25' },
                    { name: 'from 26 to 50', value: '25, 25' },
                    { name: 'from 51 to 75', value: '50, 25' },
                    { name: 'from 76 to 100', value: '75, 25' },
                )
        }),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){

        const pages = interaction.options.getString('pages') || '0, 10';
        const [start, end] = pages.split(',').map(Number);

        let title = 'Top 10 Player\'s';

        if (end > 10){
            title = `From ${start+1} to ${start+end} Player's`;
        }
        
        const leaderboardEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: `Leaderboard - ${title}`, iconURL: client.user.displayAvatarURL()})
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});
            
        try {
            const totalPlayers = await UserSchema.find().countDocuments();
            if (totalPlayers < start){
                return await interaction.reply({content: `no players from ${start} to ${end}`, ephemeral: true});
            }
            const selectedPlayers = await UserSchema.find().sort({rating: -1}).skip(start).limit(end);
            if (!selectedPlayers){
                return await interaction.reply({content: 'No players found', ephemeral: true});
            }

            let description = '';
            let rank = start;
            for(let i = 0; i < selectedPlayers.length; i++){
                if (rank < 3){
                    description += `**${rank+1}: ${selectedPlayers[i].rank}  ${selectedPlayers[i].rating} ELO ${selectedPlayers[i].username}**\n`;
                    rank++;
                    continue;
                }
                description += `${rank+1}: ${selectedPlayers[i].rank}  ${selectedPlayers[i].rating} ELO ${selectedPlayers[i].username}\n`;
                rank++;
            }

            leaderboardEmbed.setDescription(description);
                

            return await interaction.reply({embeds: [leaderboardEmbed]});
        }catch(err){
            console.log('[CMD - Leaderboard] | Catch Error')
            console.log(err);
        }
    }
}