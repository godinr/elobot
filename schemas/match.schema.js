const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const MatchSchema = new Schema({
    elo: Number,
    win: Boolean,
    kills: Number,
    deaths: Number,
}, {
    timestamps: true
});

module.exports = MatchSchema;