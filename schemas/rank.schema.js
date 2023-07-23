const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const RankSchema = new Schema({
    points: {
        win: Number,
        loss: Number,
        cqcWin: Number,
        cwcLoss: Number,
        kill: Number,
        death: Number,
        bonus: Number
    },
    ranks: {
        rank_s: Number,
        rank_g: Number,
        rank_ap: Number,
        rank_a: Number,
        rank_am: Number,
        rank_bp: Number,
        rank_b: Number,
        rank_bm: Number,
        rank_cp: Number,
        rank_c: Number,
        rank_cm: Number,
        rank_dp: Number,
        rank_d: Number,
        rank_dm: Number
    }

})

module.exports = mongoose.model('ranks', RankSchema);