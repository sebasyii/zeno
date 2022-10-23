const express = require('express');
const { peg } = require('zeno');

const app = express();

app.use(peg.timeout(1000));

app.get('/', (req, res) => {
    setTimeout(() => {
        res.send('Hello World!');
    }, 5000);
});

peg.listen(app, 3000);