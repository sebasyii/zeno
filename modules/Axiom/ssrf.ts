import fs from 'fs';
import net, { Socket } from 'net';
import http from 'http';
import https from 'https';
import ipaddr from 'ipaddr.js';
import yaml from 'js-yaml';
import minimatch from 'minimatch';
import { isCIDR } from '../utils.js';

interface axiomArgs {
  acl: { match: string; action: string }[];
}

interface Axiom {
  acl: {
    match: string | [ipaddr.IPv4 | ipaddr.IPv6, number];
    action: string;
    type: string;
  }[];
}

interface httpAgent extends http.Agent {
  createConnection: (
    options: https.RequestOptions,
    callback: (err: Error, socket: net.Socket) => void,
  ) => net.Socket;
}

interface httpsAgent extends https.Agent {
  createConnection: (
    options: https.RequestOptions,
    callback: (err: Error, socket: net.Socket) => void,
  ) => net.Socket;
}

class InvalidACLRule extends Error {
  readonly domain: string;

  constructor(domain: string) {
    super(`Domain provided ${domain} is an invalid ACL rule`);
    this.domain = domain;
  }
}

class Axiom implements Axiom {
  constructor(args: axiomArgs) {
    this.acl = [];

    for (let i = 0; i < args.acl.length; i++) {
      let match, type;

      const action = args.acl[i].action;

      if (args.acl[i].match === 'special_ranges') {
        match = null;
        type = 'special_ranges';
      } else if (isCIDR(args.acl[i].match)) {
        match = ipaddr.parseCIDR(args.acl[i].match);
        type = match[0].kind();
      } else if (ipaddr.isValid(args.acl[i].match)) {
        match = ipaddr.process(args.acl[i].match);
        type = match.kind();
      } else {
        match = args.acl[i].match;
        if (!this.validateDomainAcl(match)) throw new InvalidACLRule(match);
        type = 'domain';
      }

      this.acl.push({
        match: match,
        action: action,
        type: type,
      });
    }

    // @see https://github.com/facebook/flow/issues/7670
    // @ts-expect-error Node.js version compatibility
    http.globalAgent = this.createCustomAgent(http.globalAgent);

    // @ts-expect-error Node.js version compatibility
    https.globalAgent = this.createCustomAgent(https.globalAgent);
  }

  private checkDomain = (domain: string, match: string): boolean => {
    return minimatch(domain, match);
  };

  private validateDomainAcl = (domain: string): boolean => {
    if (!domain.includes('*')) return true;
    if (domain === '*') return true;

    // There can only be one wildcard, and it must be at the beginning
    if ((domain.match(/\*/g) || []).length > 1) return false;
    if (!domain.startsWith('*')) return false;
    if (domain[1] !== '.') return false;
    return true;
  };

  private checkACL = (ip: string, domain: string) => {
    let ipAddr = ipaddr.isValid(ip) ? ipaddr.process(ip) : null;
    for (let i = 0; i < this.acl.length; i++) {
      if (
        (this.acl[i].type === 'special_ranges' &&
          ipAddr &&
          ipAddr.range() !== 'unicast') ||
        (this.acl[i].type === 'ipv4' &&
          ipAddr &&
          ipAddr.kind() === 'ipv4' &&
          ipAddr.match(this.acl[i].match as [ipaddr.IPv4, number])) ||
        (this.acl[i].type === 'ipv6' &&
          ipAddr &&
          ipAddr.kind() === 'ipv6' &&
          ipAddr.match(this.acl[i].match as [ipaddr.IPv6, number])) ||
        (this.acl[i].type === 'domain' &&
          this.checkDomain(domain, this.acl[i].match as string))
      )
        return this.acl[i].action === 'allow';
    }

    // default deny
    return false;
  };

  public createCustomAgent = (
    agent: httpAgent | httpsAgent,
  ): httpAgent | httpsAgent => {
    const createConnection = agent.createConnection;
    agent.createConnection = (options, callback): Socket => {
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
    };
    return agent;
  };
}

const axiom = (acl: string | unknown): Axiom => {
  const args: axiomArgs = { acl: [] };

  let args: axiomArgs = { acl: [] };
  if (typeof acl === 'undefined') {
    // Block all special address blocks by default
    acl = [
      { match: 'special_ranges', action: 'deny' },
      { match: '*', action: 'allow' },
    ];
  } else if (typeof acl === 'string') {
    acl = yaml.load(fs.readFileSync(acl, 'utf8')).rules;
  }
  args.acl = acl as axiomArgs['acl'];
  return new Axiom(args);
};

export default axiom;
