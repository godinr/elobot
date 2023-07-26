const mongoose = require('mongoose');
const RankSchema = require('../schemas/rank.schema');

module.exports = {
    once: true,
    name: "ready",
    
    async execute(client){

        

        mongoose.connect(process.env.MONGO_URL).then(() => {
            console.log('Connected to MongoDB')
        }).catch((err) => {
            console.log(err)
        })


        // hard coded for now
        const guildId = "959428632084889620";
        
        const ranks = await RankSchema.findOne({guild_id: guildId});
        
        // cache rank details
        if (ranks){
            client.ranks = ranks;
            console.log(client.ranks)
        }
        
        client.suspensionTimers = new Map();
        
        console.log('Ready')
    }
}