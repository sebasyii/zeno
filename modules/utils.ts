import { IPV4_CIDR_REGEX, IPV6_CIDR_REGEX, V4_REGEX } from './constants';

const isCIDR = (target: string): boolean => {
  // if target is an IPv4 address
  return new RegExp(V4_REGEX).test(target)
    ? new RegExp(IPV4_CIDR_REGEX).test(target)
    : new RegExp(IPV6_CIDR_REGEX).test(target);
};

export { isCIDR };
