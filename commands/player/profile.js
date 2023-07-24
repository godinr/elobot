const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color, profileAuthor, footer } = require('../../configs/embeds');
const UserSchema = require('../../schemas/user.schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Display player\'s rank profile'),

    async execute(client, interaction){

        const profileEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: profileAuthor, iconURL: client.user.iconURL })
            .setTitle(interaction.member.user.username)
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.iconURL});
        
        const userId = interaction.member.id;

        try {
            const user = await UserSchema.findOne({id: userId});

            if (!user){
                return interaction.reply({content: 'Error, unable to locate your profile'});
            }

            const matchs = user.wins + user.losses;
            const kd = (user.deaths === 0)? 0 : (user.kills / user.deaths).toFixed(2);
            const description = `Rank: ${user.rank}\nRating: ${user.rating}\nMatch: ${matchs}\nWin: ${user.wins}\nLoss: ${user.losses}\nK/D: ${kd}\nKills: ${user.kills}\nDeaths: ${user.deaths}`;

            profileEmbed.setDescription(description);

            return interaction.reply({embeds: [profileEmbed]});

        } catch (err) {
            console.log(err);
            return interaction.reply({content: 'Error while trying to access db profile'})
        }
    }

}