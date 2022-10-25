const express = require('express');
const mysql = require('mysql');
const util = require('util');
const { Indirect } = require('zeno');

const app = express();

app.use(express.json());

const redis = require('redis');
const client = redis.createClient({
  url: 'redis://redis:6379',
});

client.connect();

const indirect = new Indirect({
  redisClient: client,
});

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect();
const mysqlQuery = util.promisify(connection.query).bind(connection);

const getUser = async (id) => {
  const result = await mysqlQuery('SELECT * FROM users WHERE id = ?', [id]);
  return result[0];
};

const registerUser = async (username, password) => {
  const result = await mysqlQuery(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
  );
  return result;
};

// Parse the external id parameter using the "users" model
app.get('/users/:id', indirect.middleware('users'), async (req, res) => {
  const id = req.params.id;
  const result = await getUser(id);

  if (result) {
    res.send({ username: result.username });
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/users/register', indirect.middleware(), async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const result = await registerUser(username, password);

  if (result.affectedRows === 1) {
    // Create a new external id mapping in the "users" model
    return res.send({ user: req.newExternalID('users', result.insertId) });
  }
});

app.listen(8000, () => {
  console.log('Listening on port 8000');
});
