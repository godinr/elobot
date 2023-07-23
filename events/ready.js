const mongoose = require('mongoose');

module.exports = {
    once: true,
    name: "ready",
    
    async execute(client){
        
        mongoose.connect(process.env.MONGO_URL).then(() => {
            console.log('Connected to MongoDB')
        }).catch((err) => {
            console.log(err)
        })


        console.log('Ready')
    }
}