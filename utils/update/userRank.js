
const updateUserRank = (ranks, points) => {

    
    let validRank = 'D-';

    if (points >= ranks.rank_d && points < ranks.rank_dp){
        validRank = 'D'
    }else if (points >= ranks.rank_dp && points < ranks.rank_cm){
        validRank = 'D+'
    }else if (points >= ranks.rank_cm && points < ranks.rank_c){
        validRank = 'C-'
    }else if (points >= ranks.rank_c && points < ranks.rank_cp){
        validRank = 'C'
    }else if (points >= ranks.rank_cp && points < ranks.rank_bm){
        validRank = 'C+'
    }else if (points >= ranks.rank_bm && points < ranks.rank_b){
        validRank = 'B-'
    }else if (points >= ranks.rank_b && points < ranks.rank_bp){
        validRank = 'B'
    }else if (points >= ranks.rank_bp && points < ranks.rank_am){
        validRank = 'B+'
    }else if (points >= ranks.rank_am && points < ranks.rank_a){
        validRank = 'A-'
    }else if (points >= ranks.rank_a && points < ranks.rank_ap){
        validRank = 'A'
    }else if (points >= ranks.rank_ap && points < ranks.rank_g){
        validRank = 'A+'
    }else if (points >= ranks.rank_g && points < ranks.rank_s){
        validRank = 'G'
    }else if (points >= ranks.rank_s){
        validRank = 'S'
    }

    return validRank;

}

module.exports = {
    updateUserRank
}