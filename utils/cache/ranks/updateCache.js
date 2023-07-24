const { Client } = require("discord.js")

/**
 * 
 * @param {Client} client 
 * @param {Object} points 
 */
const updateCachedPoints = (client, win, loss, kill, death, mvp) => {

    const values = {
        win: win,
        loss: loss,
        kill: kill,
        death: death,
        mvp: mvp
    }

    client.ranks.points = values;

}

module.exports = {
    updateCachedPoints
}