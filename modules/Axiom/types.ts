
import net from 'net';
import http from 'http';
import https from 'https';
import ipaddr from 'ipaddr.js';

export type validAclMatch =
  | null
  | string
  | ipaddr.IPv4
  | ipaddr.IPv6
  | [ipaddr.IPv4 | ipaddr.IPv6, number];
export type validAclType = 'special_ranges' | 'ipv4' | 'ipv6' | 'domain' | '*';

export interface httpAgent extends http.Agent {
  createConnection: (
    options: https.RequestOptions,
    callback: (err: Error, socket: net.Socket) => void,
  ) => net.Socket;
}

export interface httpsAgent extends https.Agent {
  createConnection: (
    options: https.RequestOptions,
    callback: (err: Error, socket: net.Socket) => void,
  ) => net.Socket;
}

export class InvalidACLRule extends Error {
  readonly domain: string;

  constructor(domain: string) {
    super(`Domain provided ${domain} is an invalid ACL rule`);
    this.domain = domain;
  }
}
