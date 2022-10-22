import net from 'net';
import http from 'http';
import https from 'https';

interface axiomArgs {
    blacklist: string[];
    whitelist: string[];
}

interface Axiom {
    blacklist: string[];
    whitelist: string[];
}

interface httpAgent extends http.Agent {
    createConnection: (options: https.RequestOptions, callback: (err: Error, socket: net.Socket) => void) => net.Socket;
}

interface httpsAgent extends https.Agent {
    createConnection: (options: https.RequestOptions, callback: (err: Error, socket: net.Socket) => void) => net.Socket;
}


class Axiom implements Axiom {
    constructor(args: axiomArgs) {
        this.blacklist = args.blacklist;
        this.whitelist = args.whitelist;

        // @see https://github.com/facebook/flow/issues/7670
        // @ts-expect-error Node.js version compatibility
        http.globalAgent = this.createCustomAgent(http.globalAgent);

        // @ts-expect-error Node.js version compatibility
        https.globalAgent = this.createCustomAgent(https.globalAgent);
    }

    private checkIp = (ip: string) => {
        return false;
    }

    public createCustomAgent = (agent: httpAgent | httpsAgent) => {
        const createConnection = agent.createConnection;
        agent.createConnection = (options, callback) => {
            const { host: address } = options;
            if (!this.checkIp(address)) {
                throw new Error(`Call to ${address} is blocked.`);
            }
            const socket = createConnection.call(this, options, callback);
            socket.on('lookup', (error, address) => {
                if (error || this.checkIp(address)) {
                    return false;
                }
                return socket.destroy(new Error(`Call to ${address} is blocked.`));
            });
            return socket;
        }
        return agent;
    }
}

export default Axiom;