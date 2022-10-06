const axios = require('axios');
const { getTimes } = require('../services/database');

const isWeekday = (today) => ([1, 2, 3, 4, 5].includes(today.getDay()));
const inTimeFrame = (start, end, today) => today.getHours() >= start.getHours() && today.getHours() < end.getHours() ? true : today.getMinutes() < end.getMinutes();

exports.isHours = async () => {
    // Get the time frames
    const times = await getTimes();
    const today = new Date((await axios({
        method: 'GET',
        url: 'https://timeapi.io/api/Time/current/zone',
        params: { timeZone: 'America/Los_Angeles' }
    })).data.dateTime);

    // Generate the Date Objects
    let dates = {};
    for (const key of Object.keys(times)) {
        dates[key] = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            ...(times[key].split(','))
        );
    }

    // Calculate if the time is within the time frame
    const dayType = isWeekday(today) ? 'day' : 'end';
    const start = dates[`week${dayType}Start`],
        end = dates[`week${dayType}End`];

    return inTimeFrame(start, end, today);
};