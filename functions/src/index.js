const functions = require('firebase-functions');
const express = require('express');
const { isV4Format } = require('ip');

const { Instance } = require('./services/ec2');
const { getAPIKEY, setIP, getIP } = require('./services/database');

const instance = new Instance(process.env.INSTANCE_ID);

exports.stop = functions.pubsub
    .schedule('0 23 * * *')
    .timeZone('America/Los_Angeles')
    .onRun(async () => {
        functions.logger.info((await Promise.all([
            instance.stop(), setIP("null")
        ]))[0]);
    });

const api = express();

api.use(require('cors')(
    { origin: true }
));

api.get('/ip', async (req, res) => {
    let reason = '';

    if (req.headers.authorization == null) reason = 'absent authorization header';
    else if (req.headers.authorization !== await getAPIKEY()) reason = 'invalid authorization header';
    else {
        res.json({ status: 'success', ip: await getIP() }).end();
        return;
    };

    const error = { status: 'failed', reason };
    functions.logger.error(error);
    res.json(error).end();
});

api.post('/ip', async ({ headers, body }, res) => {
    let reason = '';

    if (headers.authorization == null) reason = 'absent authorization header';
    else if (headers.authorization !== await getAPIKEY()) reason = 'invalid authorization header';
    else if (!isV4Format(body.ip)) reason = 'invalid IP';
    else {
        await setIP(body.ip);
        functions.logger.info('Successfully updated IP', body);
        res.json({ status: 'success', body }).end();
        return;
    };

    const error = { status: 'failed', reason, body };
    functions.logger.error(error);
    res.status(400 + (reason === 'invalid IP' ? 0 : 1)).json(error).end();
});

exports.api = functions.https.onRequest(api);