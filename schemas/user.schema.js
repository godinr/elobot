const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const MatchSchema = require('./match.schema');
const SuspensionSchema = require('./suspension.schema');

const UserSchema = new Schema({
    id: String,
    username: String,
    rank: String,
    rating: Number,
    match_played: Number,
    wins: Number,
    losses: Number,
    kills: Number,
    deaths: Number,
    suspended: Boolean,
    suspensions: [SuspensionSchema],
    matches: [MatchSchema]
});

module.exports = mongoose.model('users', UserSchema);
