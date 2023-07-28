const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    PermissionsBitField,
    Client,
    Interaction
} = require('discord.js');

const { color, footer} = require('../../configs/embeds');
const { shuffle } = require('../../utils/shuffleArray');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-teams')
        .setDescription('Create teams with the players in the voice channel Awaiting Match')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction){


        const teamEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: 'Create Teams', iconURL: client.user.displayAvatarURL()})
            .setDescription('Players from Awaiting Match will be sorted in 2 different teams\n and moved their teams voice channel')
            .setTimestamp()
            .setFooter({ text: footer, iconURL: client.user.displayAvatarURL()});
        
        
        try {
            const awaitingMatchId = await interaction.guild.channels.cache.find(c => c.name === 'Awaiting Match').id;
            const awaitingMatchVoiceChannel = await interaction.guild.channels.fetch(awaitingMatchId);
            
            const team1VoiceChannel = await interaction.guild.channels.cache.find(c => c.name === 'Squad Room 1');
            const team2VoiceChannel = await interaction.guild.channels.cache.find(c => c.name === 'Squad Room 2');

            const matchMembers = [];

            awaitingMatchVoiceChannel.members.forEach(m => {
                matchMembers.push(m);
            })
            console.log('matchMembers: ' + matchMembers.length)
            if (matchMembers.length <= 1){
                return await interaction.reply({content: 'Awaiting Match needs more members'})
            }

            const shuffledMatchMembers = shuffle(matchMembers);
            let team1 = " ", team2 = " ";
            let team1Size = 0, team2Size = 0;
            
            for(let i = 0; i < shuffledMatchMembers.length; i++){
                if (i % 2 === 0){
                    team1 += `${shuffledMatchMembers[i].user.username}\n`;
                    team1Size++;
                    shuffledMatchMembers[i].voice.setChannel(team1VoiceChannel);
                    continue;
                }
                team2Size++;
                team2 += `${shuffledMatchMembers[i].user.username}\n`;
                shuffledMatchMembers[i].voice.setChannel(team2VoiceChannel);
            }

            teamEmbed.setFields(
                { name: 'Squad Room 1', value: team1, inline: true},
                { name: 'Squad Room 2', value: team2, inline: true }
            );

            teamEmbed.setTitle(`${team1Size} vs ${team2Size}`);


            console.log('[CMD - Create-Teams] | Teams Generated');
            return await interaction.reply({embeds: [teamEmbed]});

        }catch(err){
            console.log(err);
            return await interaction.reply({content: 'Unexpected error creating teams'})
        }
        
    }
}