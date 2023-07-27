const { Client, Guild } = require('discord.js');
const RankSchema = require('../schemas/rank.schema');

module.exports = {
    once: false,
    name: 'guildCreate',

    async execute(client, guild){

        console.log(`[Event - GuildCreate] | guildId: ${guild.id} `)

        const guildId = guild.id;

        const guildRef = await RankSchema.findOne({guild_id: guildId});

        if (guildRef){
            console.log('Rank Table already created.');
            return;
        }

        console.log(`[Event - GuildCreate] | guildId: ${guild.id} | DB Entry Created `)

        const rankPoints = new RankSchema({
            guild_id: guildId,
            points: {
                win: 45,
                loss: -25,
                kill: 10,
                death: -8,
                mvp: 3
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

        try{
            const res = await rankPoints.save();
            console.log(res);
        }catch(err){
            console.log('[Event - GuildCreate] | Error saving to db');
            console.log(err)
        }
    }
}