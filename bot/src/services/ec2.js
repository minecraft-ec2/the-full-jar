const axios = require('axios');

const headers = { 'Authorization': process.env.API_KEY };

exports.instance = {
    start: async () => {
        try {
            const response = await axios({ method: 'POST', url: process.env.API_ENDPOINT + '/server/start', headers });
        } catch (err) {
            return false;
        };
        return true;
    },
    status: async () => {
        const response = await axios({ url: process.env.API_ENDPOINT + '/server/status', headers });

        return response.data.status;
    },
    ip: async () => {
        const response = await axios({ url: process.env.API_ENDPOINT + '/ip', headers });
        return response.data.ip;
    }
};