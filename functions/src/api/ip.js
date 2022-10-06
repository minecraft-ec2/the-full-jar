const { Router } = require('express');
const { isV4Format } = require('ip');
const { getIP, setIP } = require('../services/database');

const router = new Router();

router.get('/', async (req, res, next) => {
    res.json({ status: 'success', ip: await getIP() }).end();
});

router.post('/', async ({ body }, res, next) => {
    if (!isV4Format(body.ip)) return res.status(200).json({ reason: 'invalid IP' }).end();

    await setIP(body.ip);
    console.log('Successfully updated IP', body);
    next();
});

exports.router = router;