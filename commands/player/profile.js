const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { color, profileAuthor, footer } = require('../../configs/embeds');
const UserSchema = require('../../schemas/user.schema');
const { getAssetMap } = require('../../utils/assetsMap');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Display player\'s rank profile')
        .addUserOption(option => {
            return option
                .setName('user')
                .setDescription('The user\'s profile you want to see.')
                .setRequired(false)
            
        }),

    async execute(client, interaction){

        let title = "";
        let userId = "";
        if (interaction.options.getUser('user')){
            title = interaction.options.getUser('user').username;
            userId = interaction.options.getUser('user').id;

        }else {
            title = interaction.member.user.username;
            userId = interaction.member.id;
        }
        

        const profileEmbed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: profileAuthor, iconURL: client.user.displayAvatarURL() })
            .setTitle(title)
            .setTimestamp()
            .setFooter({text: footer, iconURL: client.user.displayAvatarURL()});

        try {
            const user = await UserSchema.findOne({id: userId});

            if (!user){
                const errorEmbed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: profileAuthor, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                .setFooter({text: footer})
                .setTitle('❌ No profile linked to the tagged member');

                return await interaction.reply({embeds: [errorEmbed]});
            }

            const kd = (user.deaths === 0)? 0 : (user.kills / user.deaths).toFixed(2);

            profileEmbed.addFields(
                { name: 'Rank', value: user.rank, inline: true},
                { name: 'Rating', value: String(user.rating), inline: false},
                { name: 'Match', value: String(user.match_played), inline: true},
                { name: 'Wins', value: String(user.wins), inline: true},
                { name: 'Losses', value: String(user.losses), inline: true},
                { name: 'K/D', value: String(kd), inline: true},
                { name: 'Kills', value: String(user.kills), inline: true},
                { name: 'Deaths', value: String(user.deaths), inline: true},
            )

            // load rank image
            const assetMap = getAssetMap();
            const asset = assetMap.get(user.rank.toLowerCase());
            
            const file = new AttachmentBuilder(`${asset.path}`);
            profileEmbed.setThumbnail(`attachment://${asset.name}`)

            return await interaction.reply({embeds: [profileEmbed], files: [file]});

        } catch (err) {
            console.log(err);
            return await interaction.reply({content: 'Error while trying to access db profile'})
        }
    }

}