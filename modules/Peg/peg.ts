import { NextFunction, Request, Response } from "express";

const cluster = require('cluster');
const { Request, Response, NextFunction } = require('express');
const cCPUs = require('os').cpus().length;

const listen = (app, port) => {

    if (cluster.isMaster) {
        // Create a worker for each CPU
        for (let i = 0; i < cCPUs; i++) {
            cluster.fork();
        }
        cluster.on('online', function (worker) {
            console.log('Worker ' + worker.process.pid + ' is online.');
        });
        cluster.on('exit', function (worker, code, signal) {
            // Automatically respawn the worker if it dies
            console.log('Worker ' + worker.process.pid + ' died.');
            cluster.fork();
        });
    } else {
        app.listen(port);
    }
};

const timeout = (ms: number) => {

    return (req: Request, res: Response, next: NextFunction) => {
        setTimeout(() => {
            res.sendStatus(504);
            process.exit();
        }, ms);

        next();
    };
};

export default { listen, timeout };