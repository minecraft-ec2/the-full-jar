const axios = require('axios');
const { getTimes } = require('../services/database');

const cloneDate = (date) => new Date(date.getTime());
const isWeekday = () => ([1, 2, 3, 4, 5].includes((new Date()).getDay()));

exports.isHours = async () => {
    const now = new Date((await axios({
        url: 'https://timeapi.io/api/Time/current/zone',
        params: { timeZone: 'America/Los_Angeles' }
    })).data.dateTime);

    const times = await getTimes();
    let objects = {};
    for (const key of Object.keys(times)) {
        const date = cloneDate(now);
        const [hour, minute] = times[key].split(',');
        date.setHours(hour, minute);
        objects[key] = date;
    };

    if (isWeekday()) {
        return now > objects['weekdayStart'] && now < objects['weekdayEnd']
    } else {
        return now > objects['weekendStart'] && now < objects['weekendEnd']
    };
};