# Peg

Prevents [application-level DOS](https://www.invicti.com/blog/web-security/application-level-denial-service-guide/) attacks by stopping computationally expensive route handlers after a timeout.

## The Problem

Application-level DOS attacks like Regular Expression Denial of Service (ReDoS) can hog process memory and CPU. Given the sheer number of ReDoS issues added to the CVE database every now and then, it is evendent that such vulnerabilities are a common occurrence. Other examples include SQL wildcard attacks, password hashing issues, and headless browser abuse.

One approach to harden a server against such attacks would be to kill computationally expensive tasks after a given timeout. One might use the [Express timeout middleware](https://expressjs.com/en/resources/middleware/timeout.html) to respond with a timeout error after a given timeout. However, this does not stop the actual route handler, allowing the requests to continue hogging CPU resources indefinitely.

> While the library will emit a ‘timeout’ event when requests exceed the given timeout, node will continue processing the slow request until it terminates. Slow requests will continue to use CPU and memory, even if you are returning a HTTP response in the timeout callback. For better control over CPU/memory, you may need to find the events that are taking a long time (3rd party HTTP requests, disk I/O, database calls) and find a way to cancel them, and/or close the attached sockets.

## How Peg Works

When running `peg.listen(app: Application, port: number)`, Peg starts a cluster of workers. `peg.timeout(ms: number)` can then be used to set the timeout for each route handler. This timeout measures the time taken from the moment Peg receives the request, and should be a significant deviation from your route handler's usual response time.

Peg will run the route handler in a new [VM](https://nodejs.org/api/vm.html#vm-executing-javascript) context.

```javascript
app.get('/', peg.timeout(1000, (req, res) => {
    doStuff();
    res.send('Stuff has been done.');
}));

module.exports = { doStuff }
```

### Synchronous Tasks

The case of synchronous tasks is more straightforward. After the given timeout of 1000ms, the VM halts execution, and a 504 Gateway Timeout is returned to the client.

```javascript
const loop = () => {
    while (1) console.log(Date.now());
}

app.use(peg.timeout(1000));

app.get('/', (req, res) => {
    loop();
    res.send('This should never be reached');
});
```

### Asynchronous Tasks

The case of asynchronous tasks can be a little more tricky. Because of JavaScript's single-threaded nature and how its [event loop](https://javascript.info/event-loop) works, these are handled by killing the current process. A new worker is automatically started to replace it. Since Peg uses a cluster of workers, the server does not experience any downtime.

The following routes will both respond with a 504 Gateway Timeout.

```javascript
app.get('/async-1', peg.timeout(1000), async (req, res) => {
    const result = await mysqlQuery('SELECT SLEEP(2);');
    res.send('This should never be reached');
});

app.get('/async-2', peg.timeout(1000), (req, res) => {
    setTimeout(() => res.send('This should never be reached'), 2000);
});
```

In the console we can see that a worker was killed and restarted to achieve this.

```text
Worker 32 died.
Worker 75 is online.
```

There is a limitation when dealing with asynchronous events.

In the above examples, the call stack was temporarily empty. In the first example, the server was waiting for an I/O event from the MySQL server and in the second, the `setTimeout` was not yet due. This gave us the breathing room to kill the worker, thus ending the asynchronous task. Fortunately, this applies to most general use cases.

However, if a CPU-intensive operation happens during the execution of a callback function, the worker can only be killed when the call stack next frees up (and not in the middle of executing the CPU-intensive callback function). During the time that the call stack is executing code, the event loop is blocked.

In this example, Peg will never get the chance to kill the task becasue the loop hogs the thread forever.

```javascript
const loop = () => {
    while (1) console.log(Date.now());
}

// This task will not be killed
app.get('/async-3', peg.timeout(1000), async (req, res) => {
    await Promise.resolve().then(loop);
    res.send('This should never be reached');
});
```

Further reading: [JavaScript Event Loop And Call Stack Explained](https://felixgerschau.com/javascript-event-loop-call-stack/).
