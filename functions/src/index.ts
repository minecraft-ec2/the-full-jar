// Import Modules
import * as functions from 'firebase-functions';
import * as express from 'express';

// Import Services
import { instance } from './services/ec2';
import { getApiKey, getIp, updateIp } from './services/firebase';

// Validators
import { isHours } from './helpers/time';
import { isV4Format } from 'ip';

// Auto Instance Stop
const stop = async () => {
    functions.logger.info(
        instance.stop()
    );
};

exports.weekday = functions.pubsub
    .schedule('0 20 * * 1-5')
    .timeZone('America/Los_Angeles')
    .onRun(stop);

exports.weekend = functions.pubsub
    .schedule('0 21 * * 0,6')
    .timeZone('America/Los_Angeles')
    .onRun(stop);

// App Endpoints
export const stats = functions.https.onCall(async (data, context) => {
    if (context.auth != null) {
        const [status, ip] = await Promise.all([
            instance.status(),
            getIp()
        ]);

        return {
            status,
            ip
        };
    };

    return {
        status: 'stopped',
        ip: 'null'
    };
});

export const start = functions.https.onCall(async (data, context) => {
    if (await isHours() || process.env.FUNCTIONS_EMULATOR) {
        await instance.start();
        return {
            response: 'Instance start request successful'
        }
    } else {
        functions.logger.warn(`Authorized server start request. Client check might have failed! [invoked by ${context.auth?.token.email}]`);
        return {
            response: 'Time out of bounds'
        }
    }
});

// IP Endpoint
const api = express();

api.post('/ip', async ({ headers, body }, response) => {
    if (headers.authorization !== await getApiKey()) {
        functions.logger.warn('Unauthorized request!');
        return response.status(401).json({ reason: 'unauthorized request' }).end();
    };

    if (!isV4Format(body.ip)) {
        return response.status(400).json({ reason: 'invalid IP' }).end();
    };

    await updateIp(body.ip);
    functions.logger.info('Successfully updated IP', body);
    return response.status(200).end()
});

exports.api = functions.https.onRequest(api);