import { Router } from 'express';

import { isV4Format } from 'ip';
import { updateIp } from '../services/firebase';

export const IpRouter = Router();

IpRouter.post('/', async ({ body }, response) => {
    if (!isV4Format(body.ip)) response.status(200).json({ reason: 'invalid IP' }).end();

    await updateIp(body.ip);
    console.log('Successfully updated IP', body);
});