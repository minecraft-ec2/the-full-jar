const { Router } = require('express');
const { instance } = require('../services/ec2');
const { isHours } = require('../helpers/time');
const { ConversionTaskFilterSensitiveLog } = require('@aws-sdk/client-ec2');

const router = new Router();

router.post('/start', async (req, res) => {
    if (await isHours()) {
        await instance.start()
        res.status(200).json({}).end();
    } else {
        res.status(401).json({ reason: 'out of time bounds' })
    }
});

router.get('/status', async (req, res) => {
    res.status(200).json({ status: await instance.status() }).end();
});

exports.router = router;