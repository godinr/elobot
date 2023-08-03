const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
const { color, footer } = require('../../configs/embeds');
const UserSchema = require('../../schemas/user.schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('matches')
        .setDescription('View the matches (max 6) of a player')
        .addUserOption(option => option.setName('player').setDescription('Player to view matches of').setRequired(false)),
    
        async execute(client, interaction){
            const taggedUser = interaction.options.getUser('player');
            const userId = taggedUser ? taggedUser.id : interaction.member.id;

            try {
                
                const user = await UserSchema.findOne({id: userId});

                if (!user){
                    console.log('[CMD - Matches] | User not found')
                    return await interaction.reply({content: 'User not found in database'});
                }

                if(!user.matches){
                
                    console.log('[CMD - Matches] | No matches found');
                    return await interaction.reply({content: 'No matches found for this user'});
                }

                const matchesEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({name: 'Latest Matches', iconURL: client.user.displayAvatarURL()}) 
                    .setTitle(`${user.username}`)
                    .setTimestamp()
                    .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});


                const matches = user.matches;
               
                if (matches.length === 0){
                    console.log('[CMD - Matches] | No matches found');
                    matchesEmbed.setDescription('No matches found');
                    return await interaction.reply({embeds: [matchesEmbed]});
                }

                let matchCount = 0;
                let winString = '', timeString = '', dateString = '', dateTitle = '', eloString = '';
                let totalWins = 0, totalElo = 0, totalkd = 0, totalKills = 0, totalDeaths = 0;
                
                for(let i = matches.length-1; i >= 0; i--){
                    
                    if (matchCount === 6) break;
                    
                    totalWins += matches[i].win ? 1 : 0;
                    totalElo += matches[i].elo;
                    totalKills += matches[i].kills;
                    totalDeaths += matches[i].deaths;
                    totalkd = totalDeaths === 0 ? totalKills : (totalKills/totalDeaths).toFixed(2);

                    winString = matches[i].win ? "Win" : "Loss";
                    dateString = matches[i].createdAt.toLocaleDateString().split('-').splice(1).join('/');
                    timeString = matches[i].createdAt.toLocaleTimeString().split(':').splice(0,2).join(':')
                    dateTitle = `${dateString} - ${timeString}`;
                    eloString = matches[i].elo > 0 ? `**⬆${matches[i].elo}**` : `**⬇${(matches[i].elo)*-1}**`;
                    
                    matchesEmbed.addFields(
                        { name: `${winString}`, value: `${dateTitle}\nelo: ${eloString}\nkills: **${matches[i].kills}**\ndeaths: **${matches[i].deaths}**`, inline: true }
                    )
                    
                    const matchPlayed = matchCount+1;
                    matchesEmbed.setDescription(`Last **${matchPlayed}** matches\nWins: **${totalWins}**, Elo: **${totalElo}**, K/D: **${totalkd}**`);  
                    matchCount++;
                }


                await interaction.reply({embeds: [matchesEmbed]});

            } catch (error) {
                console.log(error)
            }
        }
}