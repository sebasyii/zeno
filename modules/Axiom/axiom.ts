import { Socket } from 'net';
import http from 'http';
import https from 'https';
import ipaddr from 'ipaddr.js';
import minimatch from 'minimatch';
import { isCIDR } from '../ip_utils.js';
import {
  validAclMatch,
  validAclType,
  httpAgent,
  httpsAgent,
  InvalidACLRule,
} from './types';
import { loadYamlFile } from './file';

interface Axiom {
  acl: {
    match: validAclMatch;
    action: 'allow' | 'deny';
    type: validAclType;
  }[];
}

interface axiomArgs {
  acl: { match: string; action: 'allow' | 'deny' }[];
}

class Axiom implements Axiom {
  constructor(args: axiomArgs) {
    this.acl = [];

    for (const acl of args.acl) {
      let match: validAclMatch, type: validAclType;
      const action = acl.action;

      if (acl.match === 'special_ranges') {
        match = null;
        type = 'special_ranges';
      } else if (isCIDR(acl.match)) {
        match = ipaddr.parseCIDR(acl.match);
        type = match[0].kind();
      } else if (ipaddr && ipaddr.isValid(acl.match)) {
        match = ipaddr.process(acl.match);
        type = match.kind();
      } else if (acl.match === '*') {
        match = acl.match;
        type = '*';
      } else {
        match = acl.match;
        if (!this.validateDomainAcl(match)) throw new InvalidACLRule(match);
        type = 'domain';
      }

      this.acl.push({ match, action, type });
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
    if (!domain.startsWith('*')) return false;
    if (domain.match(/\*/g).length > 1) return false;

    // The wildcard cannot be part of a subdomain
    if (domain[1] !== '.') return false;
    return true;
  };

  private checkACL = (ip: string, domain?: string): boolean => {
    const ipAddr = ipaddr.isValid(ip) ? ipaddr.process(ip) : null;
    for (const acl of this.acl) {
      if (
        (acl.type === 'special_ranges' &&
          ipAddr &&
          ipAddr.range() !== 'unicast') ||
        (acl.type === 'ipv4' &&
          ipAddr &&
          ipAddr.kind() === 'ipv4' &&
          ipAddr.match(acl.match as [ipaddr.IPv4, number])) ||
        (acl.type === 'ipv6' &&
          ipAddr &&
          ipAddr.kind() === 'ipv6' &&
          ipAddr.match(acl.match as [ipaddr.IPv6, number])) ||
        (acl.type === 'domain' &&
          domain &&
          this.checkDomain(domain, acl.match as string)) ||
        (acl.type === '*' && acl.match === '*')
      )
        return acl.action === 'allow';
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

const axiom = (
  acl: string | axiomArgs['acl'] = [
    { match: 'special_ranges', action: 'deny' },
    { match: '*', action: 'allow' },
  ],
): Axiom => {
  // Block all special address blocks by default

  if (typeof acl === 'string') {
    acl = loadYamlFile(acl).rules;
  }
  const args: axiomArgs = { acl };
  return new Axiom(args);
};

export default axiom;
