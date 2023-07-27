const mongoose = require('mongoose');
const RankSchema = require('../schemas/rank.schema');

module.exports = {
    once: true,
    name: "ready",
    
    async execute(client){

        

        mongoose.connect(process.env.MONGO_URL).then(() => {
            console.log('[Event - Ready] | Connected to MongoDB')
        }).catch((err) => {
            console.log(err)
        })


        // TODO 
        // hard coded for now
        const guildId = process.env.GUILD_ID;
        console.log(`[Event - Ready] | Env Guild ${guildId}`);
        
        const ranks = await RankSchema.findOne({guild_id: guildId});
        
        // cache rank details
        if (ranks){
            client.ranks = ranks;
        }
        
        // create map to cache suspensionTimers
        client.suspensionTimers = new Map();

        console.log('[Event - Ready] | Elo Bot Online.')
    }
}