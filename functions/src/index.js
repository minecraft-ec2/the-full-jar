const functions = require('firebase-functions');
const { Instance } = require('./services/ec2');

process.env = Object.assign(process.env, require('./config.json'));

const instance = new Instance(process.env.INSTANCE_ID);

//https://crontab.guru/#0_22_*_*_1-5
// export const stop = functions.pubsub
//     .schedule('0 22 * * 1-5')
//     .timeZone('America/Los_Angeles')
//     .onRun(async () => {
//         functions.logger.info(await instance.stop());
//     });
exports.stop = functions.https.onRequest(async (req, res) => {
    res.end(await instance.status());
});