# Indirect

Prevents Insecure Direct Object References (IDOR) by generating cryptographically-secure **external**-facing IDs that map to sensitive internal-facing ones.

## Example Usage

Initialize Indirect with a Redis client.

```javascript
const redis = require('redis')
const client = redis.createClient({
    url: "redis://redis:6379"
});

client.connect();

const indirect = new Indirect({
    redisClient: client
});

```

Use the `req.newExternalID` method to create a new external-facing ID in the `users` scope that maps to the internal-facing database record ID.

```javascript
app.post('/users/register', indirect.middleware(), async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const result = await registerUser(username, password);

    if (result.affectedRows === 1) {

        // Create a new external id mapping in the "users" model
        return res.send({ user: req.newExternalID("users", result.insertId) });
    }
});
```

The middleware automatically parses all URL parameters (in `req.params`), query parameters (in `req.query`) and body parameters (in `req.body`) and replaces them with the corresponding internal-facing ID based on the specified scope. If no scope is provided, the IDs will not be replaced.

```javascript
// Parse the external id parameter using the "users" model
app.get('/users/:id', indirect.middleware("users"), async (req, res) => {
    const id = req.params.id;
    const result = await getUser(id);

    if (result) {
        res.send({ username: result.username });
    } else {
        res.status(404).send('User not found');
    }
});
```

Full `docker-compose` example [here](../../examples/idor/)