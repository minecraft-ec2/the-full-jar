import { Axios } from 'axios';
import { getTimeConstraints } from '../services/firebase';

const cloneDate = (date: Date) => new Date(date.getTime());
const isWeekday = () => ([1, 2, 3, 4, 5].includes((new Date()).getDay()));

const axios = new Axios();

export const isHours = async () => {
    const now = new Date((await axios.get('https://timeapi.io/api/Time/current/zone', {
        url: 'https://timeapi.io/api/Time/current/zone',
        params: { timeZone: 'America/Los_Angeles' }
    })).data.dateTime);

    const times = await getTimeConstraints();

    let objects = {};
    // @ts-ignore - this is defined
    for (const key of Object.keys(times)) {
        const date = cloneDate(now);
        // @ts-ignore - this is defined
        const [hour, minute] = times[key].split(',');
        date.setHours(hour, minute);
        // @ts-ignore - this is obviously not undefined
        objects[key] = date;
    };

    if (isWeekday()) {
        // @ts-ignore - this is defined above
        return now > objects['weekdayStart'] && now < objects['weekdayEnd']
    } else {
        // @ts-ignore - this is defined above
        return now > objects['weekendStart'] && now < objects['weekendEnd']
    };
};