import { Application, NextFunction, Request, Response } from 'express';
import { createContext, runInContext } from 'vm';
import cluster from 'cluster';
import { cpus } from 'os';

// const cCPUs = cpus().length;

const listen = (
  app: Application,
  port: number,
  cpusCount: number = cpus().length,
): void => {
  if (cluster.isPrimary) {
    // Create a worker for each CPU
    for (let i = 0; i < cpusCount; i++) {
      cluster.fork();
    }
    cluster.on('online', function (worker) {
      console.log(`Worker ${worker.process.pid} is online.`);
    });
    cluster.on('exit', function (worker, _code, _signal) {
      // Automatically respawn the worker if it dies
      console.log(`Worker ${worker.process.pid} died.`);
      cluster.fork();
    });
  } else {
    app.listen(port);
  }
};

const timeout = (ms: number) => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (req: Request, res: Response, next: NextFunction) => {
    // https://nodejs.org/api/vm.html#timeout-interactions-with-asynchronous-tasks-and-promises
    // Deal with the global task queues

    setTimeout(() => {
      if (res.headersSent) {
        return;
      }
      res.sendStatus(504);
      process.exit();
    }, ms);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const cloneGlobal = () =>
      Object.defineProperties(
        { ...global },
        Object.getOwnPropertyDescriptors(global),
      );

    const context = createContext(
      { req, res, next, ...cloneGlobal() },
      { microtaskMode: 'afterEvaluate' },
    );

    try {
      runInContext(`next()`, context, { timeout: ms });
    } catch (err) {
      if (err.code !== 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
        throw err;
      }
      if (res.headersSent) {
        return;
      }
      res.sendStatus(504);
    }
  };
};

export default { listen, timeout };
