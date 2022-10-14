// Import Modules
import * as functions from 'firebase-functions';
import * as express from 'express';

// Import Firebases
import { instance } from './services/ec2';
import { getIp } from './services/firebase';

// Import Middleware
import { AuthMiddleware } from './middleware/auth';

// Import API Routers
import { IpRouter } from './api/ip';

// Helpers
import { isHours } from './helpers/time';

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

// Additional API
export const api = express();

// Authorization
api.use(AuthMiddleware);

// API Routers
api.use('/ip', IpRouter);

export const stats = functions.https.onRequest(async (request, response) => {
    const [status, ip] = await Promise.all([
        instance.status(),
        getIp()
    ]);

    console.log(await getIp())

    response.status(200).json({ status, ip }).end();
});

export const start = functions.https.onCall(async () => {
    if (await isHours() || process.env.FUNCTIONS_EMULATOR) {
        await instance.start();
    } else {
        functions.logger.warn('Authorized server start request. Client check might have failed!');
    }
});