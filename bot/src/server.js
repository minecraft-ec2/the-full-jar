const app = require('express')();

app.get('/health', (req, res) => res.status(200).end(""));

app.listen(3000, () => require('./bot'));