const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    loadClientEvents: function(client){

        const eventsPath = path.join(__dirname, '../events');
        const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventsFiles){
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            
            if (event.once){
                client.once(event.name, (...args) => event.execute(client, ...args));
            } else {
                client.on(event.name, (...args) => event.execute(client, ...args));
            }
        }
    }
}