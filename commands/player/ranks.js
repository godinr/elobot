const { SlashCommandBuilder, Client, Interaction, EmbedBuilder } = require('discord.js');
const { color, footer } = require('../../configs/embeds');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranks')
        .setDescription('View the points needed for all ranks.'),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @returns 
     */
    async execute(client, interaction){
        
        const rankEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: 'Ranks', iconURL: client.user.displayAvatarURL()})
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});

        const ranks = client.ranks.ranks;
        
        for (const rank in ranks){
            
            if (rank.startsWith("$")){
                break;
            }

            let parsedRank = rank.split('_')[1].replace('p','+').replace('m','-').toUpperCase();
            
            if(parsedRank === 'S' || parsedRank === 'G'){
                rankEmbed.addFields({name: parsedRank, value: String(ranks[rank]), inline: false})
                continue;
            }

            rankEmbed.addFields({name: parsedRank, value: String(ranks[rank]), inline: true})
        }
        
        return await interaction.reply({embeds : [rankEmbed]})
    }

}