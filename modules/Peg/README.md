# Peg

Prevents [application-level DOS](https://www.invicti.com/blog/web-security/application-level-denial-service-guide/) attacks by stopping computationally expensive route handlers after a timeout.

## The Problem

Application-level DOS attacks like Regular Expression Denial of Service (ReDoS) can hog process memory and CPU. Given the sheer number of ReDoS issues added to the CVE database every now and then, it is evendent that such vulnerabilities are a common occurrence. Other examples include SQL wildcard attacks, password hashing issues, and headless browser abuse.

One approach to harden a server against such attacks would be to kill computationally expensive tasks after a given timeout. One might use the [Express timeout middleware](https://expressjs.com/en/resources/middleware/timeout.html) to respond with a timeout error after a given timeout. However, this does not stop the actual route handler, allowing the requests to continue hogging CPU resources indefinitely.

> While the library will emit a ‘timeout’ event when requests exceed the given timeout, node will continue processing the slow request until it terminates. Slow requests will continue to use CPU and memory, even if you are returning a HTTP response in the timeout callback. For better control over CPU/memory, you may need to find the events that are taking a long time (3rd party HTTP requests, disk I/O, database calls) and find a way to cancel them, and/or close the attached sockets.

## How Peg Works

When running `peg.listen(app, port)`, Peg starts a cluster of workers. `peg.timeout(ms)` can then be used as a middleware to set the timeout for each route handler. This timeout measures the time taken from the moment Peg receives the request, and should be a significant deviation from your route handler's usual response time.

After the given timeout, the process will exit and a new worker will be spawned to replace it.