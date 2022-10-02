const axios = require('axios');

const setup = () => {
    const weekdayStart = new Date(),
        weekendStart = new Date(),
        weekdayEnd = new Date(),
        weekendEnd = new Date();

    weekdayStart.setHours(16, 30, 0, 0);
    weekdayEnd.setHours(23, 0, 0, 0);
    weekendStart.setHours(11, 0, 0, 0);
    weekendEnd.setHours(23, 0, 0, 0);

    return { weekdayStart, weekdayEnd, weekendStart, weekendEnd };
};

const isWeekday = () => [1, 2, 3, 4, 5].includes((new Date()).getDay());


exports.isHours = async () => {
    const { weekdayStart, weekdayEnd, weekendStart, weekendEnd } = setup();
    const { data: response } = await axios({
        url: 'https://timeapi.io/api/Time/current/zone?timeZone=America/Los_Angeles',
    });
    const now = new Date(response.dateTime);

    return (isWeekday() ?
        now > weekdayStart && now < weekdayEnd
        :
        now > weekendStart && now < weekendEnd);
};