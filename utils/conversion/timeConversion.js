
const numberTimeToText = (numberTime) => {

    const minutes = numberTime / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    let textTime = 'minute(s)';
    let timeValue = minutes
    
    if (hours >= 1) {
        textTime = 'hour(s)';
        timeValue = hours;
    }

    if (days >= 1) {
        textTime = 'day(s)';
        timeValue = days;
    }

    return `${timeValue} ${textTime}`;

};


module.exports = {
    numberTimeToText
}