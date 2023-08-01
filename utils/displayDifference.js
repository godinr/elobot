
const displayDifference = (value, diff) => {

    if (diff === 0){
        return `${value}`;
    }

    if(diff < 0){
        diff *= -1;
        return `${value} | ⬇**${diff}**`;
    }

    return `${value} | ⬆**${diff}**`;
}

const displayRankDifference = (rank, diff) => {

}

module.exports = {
    displayDifference
}