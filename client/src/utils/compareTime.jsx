const compareTime = ({ time, date }) => {
    const now = new Date();
    const currentTime = now.getHours() + ':' + now.getMinutes();
    const currentDate = `${new Date().getFullYear()}-${String(
        new Date().getMonth() + 1
    ).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
    console.log(currentTime, date, currentDate);
    console.log(time < currentTime);
    console.log(date <= currentDate);
    if (time && date && time < currentTime && date <= currentDate) {
        return 'unfinished';
    } else if (time && !date && time < currentTime) {
        return 'unfinished';
    } else if (date && !time && date < currentDate) {
        return 'unfinished';
    }
    return 'finishing';
};

export default compareTime;
