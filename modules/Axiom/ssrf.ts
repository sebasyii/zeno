import net from 'net';
import http from 'http';
import https from 'https';
import ipaddr from 'ipaddr.js';
import { isCIDR } from '../utils.js';

interface axiomArgs {
    acl: { match: string, action: string }[];
}

interface Axiom {
    acl: { match: string | [ipaddr.IPv4 | ipaddr.IPv6, number], action: string, type: string }[];
}

interface httpAgent extends http.Agent {
    createConnection: (options: https.RequestOptions, callback: (err: Error, socket: net.Socket) => void) => net.Socket;
}

interface httpsAgent extends https.Agent {
    createConnection: (options: https.RequestOptions, callback: (err: Error, socket: net.Socket) => void) => net.Socket;
}

class Axiom implements Axiom {
    constructor(args: axiomArgs) {
        this.acl = [];

        for (let i = 0; i < args.acl.length; i++) {

            let match, action, type;

            action = args.acl[i].action;

            if (isCIDR(args.acl[i].match)) {
                match = ipaddr.parseCIDR(args.acl[i].match);
                type = match[0].kind();
            } else if (ipaddr.isValid(args.acl[i].match)) {
                match = ipaddr.process(args.acl[i].match);
                type = match.kind();
            } else {
                match = args.acl[i].match;
                type = 'domain';
            }

            this.acl.push({
                match: match,
                action: action,
                type: type
            })
        }

        // @see https://github.com/facebook/flow/issues/7670
        // @ts-expect-error Node.js version compatibility
        http.globalAgent = this.createCustomAgent(http.globalAgent);

        // @ts-expect-error Node.js version compatibility
        https.globalAgent = this.createCustomAgent(https.globalAgent);
    }

    private checkDomain = (domain: string, match: string) => {
        if (match.startsWith('*')) {
            match = match.slice(1);
            return domain.endsWith(match);
        }
        return domain === match;
    }

    private checkACL = (ip: string, domain: string) => {
        let ipAddr = ipaddr.isValid(ip) ? ipaddr.process(ip) : null;
        for (let i = 0; i < this.acl.length; i++) {
            if (this.acl[i].type === 'ipv4' && ipAddr && ipAddr.kind() === 'ipv4' && ipAddr.match(this.acl[i].match as [ipaddr.IPv4, number])) {
                return this.acl[i].action === 'allow';
            } else if (this.acl[i].type === 'ipv6' && ipAddr && ipAddr.kind() === 'ipv6' && ipAddr.match(this.acl[i].match as [ipaddr.IPv6, number])) {
                return this.acl[i].action === 'allow';
            } else if (this.acl[i].type === 'domain' && this.checkDomain(domain, this.acl[i].match as string)) {
                return this.acl[i].action === 'allow';
            }
        }

        // default deny
        return false;
    }

    public createCustomAgent = (agent: httpAgent | httpsAgent) => {
        const createConnection = agent.createConnection;
        agent.createConnection = (options, callback) => {
            
            // If an IP address is provided, no lookup is performed.
            const { host: address } = options;
            if (!this.checkACL(address, address)) {
                throw new Error(`Call to ${address} is blocked.`);
            }
            
            const socket = createConnection.call(agent, options, callback);

            // Check IP address at lookup time
            socket.on('lookup', (error, address, family, host) => {
                if (error || this.checkACL(address, host)) {
                    return false;
                }
                return socket.destroy(new Error(`Call to ${host} is blocked.`));
            });
            return socket;
        }
        return agent;
    }
}

export default Axiom;