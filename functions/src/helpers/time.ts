import * as https from 'node:https';
import { getTimeConstraints } from '../services/firebase';

const cloneDate = (date: Date) => new Date(date.getTime());
const isWeekday = () => ([1, 2, 3, 4, 5].includes((new Date()).getDay()));

export const isHours = async () => {
    const now: Date = await new Promise((resolve, reject) => {
        https.get('https://timeapi.io/api/Time/current/zone?timeZone=America/Los_Angeles', stream => {
            let data = '';

            stream.on('data', (chunk) => data += chunk);

            stream.on('end', () => {
                resolve(
                    new Date(JSON.parse(
                        data.toString()
                    ).dateTime)
                )
            });

            stream.on('error', reject);
        });
    });

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