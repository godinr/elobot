const mongoose = require('mongoose');
const { Schema } = require('mongoose');

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
    suspendedTime: Number
});

module.exports = mongoose.model('users', UserSchema);
