const app = require('express')();

app.get('/health', (req, res) => res.status(200).end(""));

app.listen(10000, () => require('./bot'));