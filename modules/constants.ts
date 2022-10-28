import { IPv4, IPv6 } from 'ipaddr.js';

// IPv4, IPv6 and CIDR regex

const V4_REGEX =
  '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';

const V6_REGEX =
  '^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))';

const IPV4_CIDR_REGEX = `^${V4_REGEX.slice(
  1,
  -1,
)}(\\/)(([0-9]|[1-2][0-9]|3[0-2])){1}$`;
const IPV6_CIDR_REGEX = `^${V6_REGEX.slice(
  1,
)}(\\/)(\\d|[1-9]\\d|1[01]\\d|12[0-8]){1}$`;

// IPv4 and IPv6 special ranges

const IPV4_SPECIAL_RANGES = {
  unspecified: [[new IPv4([0, 0, 0, 0]), 8]],
  broadcast: [[new IPv4([255, 255, 255, 255]), 32]],
  // RFC3171
  multicast: [[new IPv4([224, 0, 0, 0]), 4]],
  // RFC3927
  linkLocal: [[new IPv4([169, 254, 0, 0]), 16]],
  // RFC5735
  loopback: [[new IPv4([127, 0, 0, 0]), 8]],
  // RFC6598
  carrierGradeNat: [[new IPv4([100, 64, 0, 0]), 10]],
  // RFC1918
  private: [
    [new IPv4([10, 0, 0, 0]), 8],
    [new IPv4([172, 16, 0, 0]), 12],
    [new IPv4([192, 168, 0, 0]), 16],
  ],
  // Reserved and testing-only ranges; RFCs 5735, 5737, 2544, 1700
  reserved: [
    [new IPv4([192, 0, 0, 0]), 24],
    [new IPv4([192, 0, 2, 0]), 24],
    [new IPv4([192, 88, 99, 0]), 24],
    [new IPv4([198, 18, 0, 0]), 15],
    [new IPv4([198, 51, 100, 0]), 24],
    [new IPv4([203, 0, 113, 0]), 24],
    [new IPv4([240, 0, 0, 0]), 4],
  ],
};

const IPV6_SPECIAL_RANGES = {
  // RFC4291, here and after
  unspecified: [new IPv6([0, 0, 0, 0, 0, 0, 0, 0]), 128],
  linkLocal: [new IPv6([0xfe80, 0, 0, 0, 0, 0, 0, 0]), 10],
  multicast: [new IPv6([0xff00, 0, 0, 0, 0, 0, 0, 0]), 8],
  loopback: [new IPv6([0, 0, 0, 0, 0, 0, 0, 1]), 128],
  uniqueLocal: [new IPv6([0xfc00, 0, 0, 0, 0, 0, 0, 0]), 7],
  ipv4Mapped: [new IPv6([0, 0, 0, 0, 0, 0xffff, 0, 0]), 96],
  // RFC6145
  rfc6145: [new IPv6([0, 0, 0, 0, 0xffff, 0, 0, 0]), 96],
  // RFC6052
  rfc6052: [new IPv6([0x64, 0xff9b, 0, 0, 0, 0, 0, 0]), 96],
  // RFC3056
  '6to4': [new IPv6([0x2002, 0, 0, 0, 0, 0, 0, 0]), 16],
  // RFC6052, RFC6146
  teredo: [new IPv6([0x2001, 0, 0, 0, 0, 0, 0, 0]), 32],
  // RFC4291
  reserved: [[new IPv6([0x2001, 0xdb8, 0, 0, 0, 0, 0, 0]), 32]],
  benchmarking: [new IPv6([0x2001, 0x2, 0, 0, 0, 0, 0, 0]), 48],
  amt: [new IPv6([0x2001, 0x3, 0, 0, 0, 0, 0, 0]), 32],
  as112v6: [new IPv6([0x2001, 0x4, 0x112, 0, 0, 0, 0, 0]), 48],
  deprecated: [new IPv6([0x2001, 0x10, 0, 0, 0, 0, 0, 0]), 28],
  orchid2: [new IPv6([0x2001, 0x20, 0, 0, 0, 0, 0, 0]), 28],
};

export {
  V4_REGEX,
  V6_REGEX,
  IPV4_CIDR_REGEX,
  IPV6_CIDR_REGEX,
  IPV4_SPECIAL_RANGES,
  IPV6_SPECIAL_RANGES,
};
