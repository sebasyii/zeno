const express = require('express');
const mysql = require('mysql');
const util = require('util');
const { peg } = require('zeno');

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
});

connection.connect();
const mysqlQuery = util.promisify(connection.query).bind(connection);

const app = express();

const loop = () => {
    while (1) console.log(Date.now());
}

app.get('/sync', peg.timeout(1000), (req, res) => {
    loop();
    res.send('This should never be reached');
});

app.get('/async-1', peg.timeout(1000), async (req, res) => {
    const result = await mysqlQuery('SELECT SLEEP(2);');
    res.send('This should never be reached');
});

app.get('/async-2', peg.timeout(1000), (req, res) => {
    setTimeout(() => res.send('This should never be reached'), 2000);
});

// This task will not be killed
app.get('/async-3', peg.timeout(1000), async (req, res) => {
    await Promise.resolve().then(loop);
    res.send('This should never be reached');
});

// Globals are preserved
app.get('/environment', peg.timeout(1000), (req, res) => {
    res.send(process.env);
});

peg.listen(app, 8000);