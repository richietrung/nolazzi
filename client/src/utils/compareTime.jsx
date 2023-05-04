const compareTime = (time = undefined, date = undefined) => {
    // Get the current time and date
    const now = new Date();
    const currentTime = now.getHours() + ':' + now.getMinutes();
    const currentDate = now.toISOString().substring(0, 10); // in YYYY-MM-DD format
    // Compare the time and date with the current time and date
    if (time && date && time < currentTime && date < currentDate) {
        return 'unfinished';
    }
    if (time && time < currentTime) return 'unfinished';
    return 'finishing';
};

export default compareTime;
