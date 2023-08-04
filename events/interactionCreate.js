const {Client, Interaction, EmbedBuilder} = require('discord.js');
const RankSchema = require('../schemas/rank.schema');
const UserSchema = require('../schemas/user.schema');
const { updateCachedPoints } = require('../utils/cache/ranks/updateCache');
const { updateUserRank } = require('../utils/update/userRank');
const { color, footer } = require('../configs/embeds');
const { displayDifference } = require('../utils/displayDifference');

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
            // logic for add-match command
            if(interaction.customId === "add-match"){
                
                // get form values
                const userId = interaction.fields.getTextInputValue('userId');
                const mvp = interaction.fields.getTextInputValue('mvp');
                const winMatch = interaction.fields.getTextInputValue('win');
                const kills = parseInt(interaction.fields.getTextInputValue('kills'));
                const deaths = parseInt(interaction.fields.getTextInputValue('deaths'));

                let containsNaN = false;
                let containsNegativeValues = false;
                let valuesTooHigh = false;

                // make sure values are numbers
                [kills, deaths].forEach((input) => {
                    if (isNaN(input)){
                        containsNaN = true;
                    }

                    if (input < 0){
                        containsNegativeValues = true;
                    }

                    if (input >= 100){
                        valuesTooHigh = true;
                    }
                });

                const errorEmbed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: 'Add Match', iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                .setFooter({text: footer});

                if (containsNaN){
                    errorEmbed.setTitle('❌ Kills & Deaths need to be numbers');
                }

                if (containsNegativeValues){
                    errorEmbed.setTitle('❌ Kills & deaths must be a positive number');
                }

                if (valuesTooHigh){
                    errorEmbed.setTitle('❌ Value too high, Enter a real number of Kills & deaths');
                }

                if (containsNaN || containsNegativeValues || valuesTooHigh){
                    return await interaction.reply({embeds: [errorEmbed]});
                }

                // init scoring variables
                let matchPoints = 0;
                let newRating = 0, newWins = 0, newLosses = 0, newKills = 0, newDeaths = 0, newMatchPlayed = 0;

                // make sure no errors throw
                try {
                    const user = await UserSchema.findOne({id: userId});

                    if (!user){
                        console.log('[Event - InteractionCreate - AddMatch] | User not found.');
                        return await interaction.reply({content: "Tagged user does not have a profile", ephemeral: true});
                    }

                    const guildUser = await interaction.guild.members.fetch(userId);
                    
                    const postMatchEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: 'Post Match Recap', iconURL: client.user.displayAvatarURL()})
                    .setTitle(`${guildUser.user.username}`)
                    .setTimestamp()
                    .setFooter({ text: footer, iconURL: client.user.displayAvatarURL()})

                    newMatchPlayed++;

                    if (winMatch.toLowerCase() === 'y'){
                        matchPoints += client.ranks.points.win;
                        newWins++;
                    }else {
                        matchPoints += client.ranks.points.loss;
                        newLosses++;
                    }
    
                    if (mvp.toLowerCase() === 'y'){
                        matchPoints += client.ranks.points.mvp;
                    }
    
                    matchPoints += (client.ranks.points.kill * kills);
                    newKills += kills;

                    matchPoints += (client.ranks.points.death * deaths);
                    newDeaths += deaths;

                    newRating += matchPoints;

                    // update db values
                    let currentRating = user.rating + newRating;
                    
                    if (currentRating < 0 ) currentRating = 0;

                    user.rating = currentRating;
                    user.wins = user.wins + newWins;
                    user.losses = user.losses + newLosses;
                    user.match_played = user.match_played + newMatchPlayed;
                    user.kills = user.kills + newKills;
                    user.deaths = user.deaths + newDeaths;

                    const userRank = updateUserRank(client.ranks.ranks, currentRating);
                    

                    if (user.rank != userRank) {
                        postMatchEmbed.setDescription(`**Rank Changed**: ${userRank}`);
                        const currentRankRole = interaction.guild.roles.cache.find(r => r.name === user.rank);
                        const newRankRole = interaction.guild.roles.cache.find(r => r.name === userRank);
                        
                        const removeCurrentRankRole = guildUser.roles.remove(currentRankRole)
                        const addNewRankRole = guildUser.roles.add(newRankRole)

                        user.rank = userRank;

                        await Promise.all([removeCurrentRankRole, addNewRankRole])
                        
                    }

                    const mathchWon = newWins > 0 ? true : false;
                    
                    user.matches.push({
                        elo: newRating,
                        win: mathchWon,
                        kills: newKills,
                        deaths: newDeaths,
                    });

                    const username = guildUser.user.username;
                
                    if (guildUser.permissions.has('ManageNicknames')){
                        console.log('[CMD - IC - Add-Match] | Unable to change user nickname');
                        
                    }else {
                        await guildUser.setNickname(`[${user.rating} ELO] ${username}`);
                        console.log('[CMD - IC - Add-Match] | Changed user nickname')
                    }

                    console.log(`[CMD - IC - Add-Match] | ${username} has ranked up to ${userRank}`);

                    // save changes
                    await user.save();


                    const matchResult = newWins > 0 ? 'Won' : 'Lost';
                    const kd = newDeaths > 0 ? (newKills / newDeaths).toFixed(2) : 0.0;
                    const mvpStr = mvp.toLowerCase() === 'y' ? 'Yes' : 'No';
                    const eloStr = matchPoints > 0 ? `**⬆|Elo**` : `**⬇|Elo**`;
                    postMatchEmbed.setFields(
                        { name: 'Match', value:  `${matchResult}`, inline: true},
                        { name: eloStr, value: `${matchPoints}`, inline: true},
                        { name: 'Mvp', value: `${mvpStr}`, inline: true},
                        { name: 'kills', value: String(newKills), inline: true},
                        { name: 'Deaths', value: String(newDeaths), inline: true},
                        { name: 'K/D', value: `${kd}`, inline: true}
                    )
                    
                    return await interaction.reply({embeds: [postMatchEmbed]});

                } catch (err) {
                    console.error(err);
                    return await interaction.reply({content: "Error trying to locate player account in the db"})
                }
            }

            if(interaction.customId === "set-points"){
                // todo update db with values 
                const win = parseInt(interaction.fields.getTextInputValue('win'));
                const loss = parseInt(interaction.fields.getTextInputValue('loss'));
                const kills = parseInt(interaction.fields.getTextInputValue('kills'));
                const deaths = parseInt(interaction.fields.getTextInputValue('deaths'));
                const mvp = parseInt(interaction.fields.getTextInputValue('mvp'));

                let containsNaN = false;

                [win, loss, kills, deaths, mvp].forEach((value) => {
                    if (isNaN(value)){
                        containsNaN = true;
                    }
                })

                if (containsNaN){
                    const errorEmbed = new EmbedBuilder()
                        .setColor(color)
                        .setAuthor({ name: 'Set Rank Points', iconURL: client.user.displayAvatarURL() })
                        .setTimestamp()
                        .setFooter({text: footer})
                        .setTitle('❌ All entries must be numbers')
                    return await interaction.reply({embeds: [errorEmbed]});
                }


                const guildId = interaction.guild.id;

                const rankPoints = new RankSchema({
                    guild_id: guildId,
                    points: {
                        win: win,
                        loss: loss,
                        kill: kills,
                        death: deaths,
                        mvp: mvp
                    },
                    ranks: {
                        rank_s: 10000,
                        rank_g: 6000,
                        rank_ap: 1800,
                        rank_a: 1400,
                        rank_am: 1250,
                        rank_bp: 1100,
                        rank_b: 900,
                        rank_bm: 700,
                        rank_cp: 575,
                        rank_c: 450,
                        rank_cm: 350,
                        rank_dp: 200,
                        rank_d: 100,
                        rank_dm: 0
                    }
                });
                

                const ranks = await RankSchema.findOne({guild_id: guildId});

                if (!ranks){
                    try {
                        rankPoints.guild_id = guildId;
                        const res = await rankPoints.save();
                        //console.log(res);
                        return interaction.reply({content: "Rank points created"})
                    }catch(err){
                        console.log(err);
                        return interaction.reply({content: "Failed to create Rank points"})
                    }
                }

                ranks.points.win = win;
                ranks.points.loss = loss;
                ranks.points.kill = kills;
                ranks.points.death = deaths;
                ranks.points.mvp = mvp;

                const res = await ranks.save();
                console.log(res);

                updateCachedPoints(client, win, loss, kills, deaths, mvp);

                const setPointsEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({name: 'Match Points Updated', iconURL:client.user.displayAvatarURL()})
                    .addFields(
                        { name: 'Win' ,value: String(win), inline: true },
                        { name: 'Loss' ,value: String(loss), inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: 'Mvp' ,value: String(mvp), inline: true },
                        { name: 'Kill' ,value: String(kills), inline: true },
                        { name: 'Death' ,value: String(deaths), inline: true },
                        
                    )
                    .setTimestamp()
                    .setFooter({text: footer, iconURL: client.user.displayAvatarURL()})
                
                return await interaction.reply({embeds: [setPointsEmbed]});
            }

            if (interaction.customId === 'fix-profile'){
                
                // get form values
                const userId = interaction.fields.getTextInputValue('userId');
                const wins = parseInt(interaction.fields.getTextInputValue('wins'));
                const losses = parseInt(interaction.fields.getTextInputValue('losses'));
                const kills = parseInt(interaction.fields.getTextInputValue('kills'));
                const deaths = parseInt(interaction.fields.getTextInputValue('deaths'));

                let containsNaN = false;
                [wins, losses, kills, deaths].forEach((input) => {
                    if (isNaN(input)){
                        containsNaN = true;
                    }
                });

                if(containsNaN){
                    return await interaction.reply({content: 'Values need to be numbers', ephemeral: true});
                }

                try {
                    const user = await UserSchema.findOne({id: userId});

                    if (!user){
                        return await interaction.reply({content: 'Tagged user does not have a profile', ephemeral: true});
                    }

                    const winDiff = wins - user.wins;
                    const lossesDiff = losses - user.losses;
                    const killsDiff = kills - user.kills;
                    const deathDiff = deaths - user.deaths;

                    const cachedPoints = client.ranks.points;
                    
                    const updatedRatingPoints = (winDiff * cachedPoints.win) + (lossesDiff * cachedPoints.loss) + (killsDiff * cachedPoints.kill) + (deathDiff * cachedPoints.death);
                    const totalRating = user.rating + updatedRatingPoints;
                    
                    user.rating = totalRating;
                    user.wins = wins;
                    user.losses = losses;
                    user.kills = kills;
                    user.deaths = deaths;
                    user.match_played = wins+losses;

                    const userRank = updateUserRank(client.ranks.ranks, totalRating);
                    
                    const guildUser = await interaction.guild.members.fetch(userId);

                    if (user.rank != userRank) {
                        const currentRankRole = interaction.guild.roles.cache.find(r => r.name === user.rank);
                        const newRankRole = interaction.guild.roles.cache.find(r => r.name === userRank);
                        

                        const removeCurrentRankRole = guildUser.roles.remove(currentRankRole)
                        const addNewRankRole = guildUser.roles.add(newRankRole)

                        user.rank = userRank;

                        await Promise.all([removeCurrentRankRole, addNewRankRole])
                        
                    }

                    const username = guildUser.user.username;
                
                    if (guildUser.permissions.has('ManageNicknames')){
                        console.log('[CMD - IC - Fix-Profile] | Unable to change user nickname');
                        
                    }else {
                        await guildUser.setNickname(`[${user.rating} ELO] ${username}`);
                        console.log('[CMD - IC - Fix-Prolile] | Changed user nickname')
                    }

                    console.log(`[CMD - IC - Fix-Profile] | ${username} has ranked up to ${userRank}`);

                    const fixProfileEmbed = new EmbedBuilder()
                        .setColor(color)
                        .setAuthor({name: 'Update Player Stats', iconURL:client.user.displayAvatarURL()})
                        .setTitle(`✅ ${guildUser.user.username} Profile Updated`)
                        .addFields(
                            { name: 'Rating', value: `${displayDifference(totalRating, updatedRatingPoints)}`, inline: true},
                            { name: 'Wins', value: `${displayDifference(wins, winDiff)}`, inline: true},
                            { name: 'Losses', value: `${displayDifference(losses, lossesDiff)}`, inline: true},
                            { name: 'Kills', value: `${displayDifference(kills, killsDiff)}`, inline: true},
                            { name: 'Deaths', value: `${displayDifference(deaths, deathDiff)}`, inline: true},
                        )
                        .setTimestamp()
                        .setFooter({text: footer, iconURL: client.user.displayAvatarURL()})

                    // save changes
                    await user.save();
                    
                    return await interaction.reply({embeds: [fixProfileEmbed]})

                } catch (error) {
                    console.log(err)
                }
            }
        }
    }
}