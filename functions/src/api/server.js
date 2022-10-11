const { Router } = require('express');
const { instance } = require('../services/ec2');
const { isHours } = require('../helpers/time');

const router = new Router();

router.post('/start', async (req, res) => {
    if (await isHours()) {
        await instance.start()
        res.status(200).json({}).end();
    } else {
        res.status(401).json({ reason: 'out of time bounds' }).end();
    }
});

router.get('/status', async (req, res) => {
    res.status(200).json({ status: await instance.status() }).end();
});

router.get('/canStart', async (req, res) => {
    console.log(await isHours());
    res.end('See Logs!');
});

exports.router = router;