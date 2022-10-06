const functions = require('firebase-functions');
const express = require('express');

const { instance } = require('./services/ec2');
const { getAPIKEY, setIP } = require('./services/database');

const stop = async () => {
    const jobs = await Promise.all([instance.stop(), setIP("null")]);
    functions.logger.info(jobs[0]);
};

exports.weekday = functions.pubsub
    .schedule('0 18 * * 1-5')
    .timeZone('America/Los_Angeles')
    .onRun(stop);

exports.weekend = functions.pubsub
    .schedule('0 23 * * 0,6')
    .timeZone('America/Los_Angeles')
    .onRun(stop);

const api = express();

api.use(require('cors')(
    { origin: true }
));

api.use(async ({ headers }, res, next) => {
    let reason;

    console.log(headers.authorization == null)

    if (headers.authorization == null) reason = 'absent authorization header';
    else if (headers.authorization !== await getAPIKEY()) reason = 'invalid authorization header';

    if (reason) res.status(401).json({ reason }).end();
    else next();
});

api.use('/ip', require('./api/ip').router);
api.use('/server', require('./api/server').router);

api.use(({ body }, res) => {
    // All Errors Bypassed - Success
    res.status(200).json({ body }).end();
});

exports.api = functions.https.onRequest(api);